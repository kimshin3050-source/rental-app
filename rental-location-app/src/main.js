// Main Application
import { initAuth, auth } from './firebase.js';
import { 
  FIXED_COMPANIES, 
  getFloorOptions, 
  ZONE_BUILDINGS, 
  ZONE_POSITIONS,
  getToday,
  formatTime,
  COMPANY_COLORS
} from './constants.js';
import {
  saveRentalLog,
  getRentalLogsByDate,
  subscribeToRentalLogs,
  getStatsByDate
} from './dataService.js';
import {
  showToast,
  toggleLoading,
  getFormData,
  resetForm,
  populateSelect,
  setTodayDate,
  switchTab,
  createStatCard,
  createZoneMarker,
  createLegendItem,
  formatNumber,
  debounce
} from './uiUtils.js';

// 전역 변수
let currentUser = null;
let unsubscribe = null;

// DOM이 로드되면 실행
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // 로딩 화면 표시
    showLoadingScreen(true);
    
    // Firebase 인증 초기화
    currentUser = await initAuth();
    displayUserInfo(currentUser);
    
    // UI 초기화
    initializeUI();
    
    // 이벤트 리스너 등록
    setupEventListeners();
    
    // 초기 데이터 로드
    await loadInitialData();
    
    // 로딩 화면 숨기기
    showLoadingScreen(false);
    
    showToast('시스템이 준비되었습니다.', 'success');
  } catch (error) {
    console.error('초기화 실패:', error);
    showLoadingScreen(false);
    showToast('시스템 초기화에 실패했습니다. 새로고침해 주세요.', 'error');
  }
});

// 로딩 화면 표시/숨기기
function showLoadingScreen(show) {
  const loadingScreen = document.getElementById('loadingScreen');
  const mainContent = document.getElementById('mainContent');
  
  if (show) {
    loadingScreen.style.display = 'flex';
    mainContent.style.display = 'none';
  } else {
    loadingScreen.style.display = 'none';
    mainContent.style.display = 'block';
  }
}

// 사용자 정보 표시
function displayUserInfo(user) {
  const userInfo = document.getElementById('userInfo');
  if (user) {
    userInfo.textContent = user.email || '익명 사용자';
  }
}

// UI 초기화
function initializeUI() {
  // 협력사 선택 옵션 추가
  const companySelect = document.getElementById('company');
  populateSelect(companySelect, FIXED_COMPANIES, '협력사 선택');
  
  // 층수 선택 옵션 추가
  const floorSelect = document.getElementById('floor');
  populateSelect(floorSelect, getFloorOptions(), '층수 선택');
  
  // 구역 선택 옵션 추가
  const zoneSelect = document.getElementById('zone');
  const zoneOptions = Object.keys(ZONE_BUILDINGS).map(zone => ({
    value: zone,
    text: `ZONE ${zone} - ${ZONE_BUILDINGS[zone]}`
  }));
  populateSelect(zoneSelect, zoneOptions, '구역 선택');
  
  // 날짜 필드 초기값 설정
  setTodayDate(document.getElementById('workDate'));
  setTodayDate(document.getElementById('viewDate'));
  setTodayDate(document.getElementById('mapDate'));
  
  // 지도 협력사 필터 옵션 추가
  const mapCompanySelect = document.getElementById('mapCompany');
  populateSelect(mapCompanySelect, FIXED_COMPANIES, '전체 협력사');
}

// 이벤트 리스너 설정
function setupEventListeners() {
  // 탭 전환
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tabName = e.target.dataset.tab;
      switchTab(tabName);
      
      // 탭 전환시 데이터 새로고침
      if (tabName === 'view') {
        loadViewData();
      } else if (tabName === 'map') {
        loadMapData();
      }
    });
  });
  
  // 폼 제출
  document.getElementById('rentalForm').addEventListener('submit', handleFormSubmit);
  
  // 리셋 버튼
  document.getElementById('resetBtn').addEventListener('click', () => {
    resetForm(document.getElementById('rentalForm'));
    showToast('폼이 초기화되었습니다.', 'info');
  });
  
  // 날짜 변경시 데이터 로드
  document.getElementById('viewDate').addEventListener('change', debounce(loadViewData, 300));
  document.getElementById('mapDate').addEventListener('change', debounce(loadMapData, 300));
  document.getElementById('mapCompany').addEventListener('change', debounce(loadMapData, 300));
  
  // 새로고침 버튼
  document.getElementById('refreshBtn').addEventListener('click', loadViewData);
  document.getElementById('mapRefreshBtn').addEventListener('click', loadMapData);
}

// 폼 제출 처리
async function handleFormSubmit(e) {
  e.preventDefault();
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  toggleLoading(submitBtn, true);
  
  try {
    const formData = getFormData(e.target);
    
    // 추가 데이터 설정
    formData.editorEmail = currentUser?.email || 'anonymous';
    formData.editorId = currentUser?.uid || 'anonymous';
    formData.rentalCount = parseInt(formData.rentalCount) || 0;
    
    // Firestore에 저장
    const result = await saveRentalLog(formData);
    
    if (result.success) {
      showToast('작업이 성공적으로 등록되었습니다.', 'success');
      resetForm(e.target);
      
      // 오늘 날짜로 재설정
      setTodayDate(document.getElementById('workDate'));
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('폼 제출 오류:', error);
    showToast('등록 중 오류가 발생했습니다.', 'error');
  } finally {
    toggleLoading(submitBtn, false);
  }
}

// 초기 데이터 로드
async function loadInitialData() {
  await loadViewData();
}

// 작업 현황 데이터 로드
async function loadViewData() {
  const viewDate = document.getElementById('viewDate').value;
  
  if (!viewDate) {
    showToast('날짜를 선택해 주세요.', 'warning');
    return;
  }
  
  // 기존 구독 해제
  if (unsubscribe) {
    unsubscribe();
  }
  
  // 실시간 구독 설정
  unsubscribe = subscribeToRentalLogs(viewDate, async (logs) => {
    // 통계 업데이트
    const stats = await getStatsByDate(viewDate);
    updateStatsDisplay(stats);
    
    // 테이블 업데이트
    updateTableDisplay(logs);
  });
}

// 통계 표시 업데이트
function updateStatsDisplay(stats) {
  const statsGrid = document.getElementById('statsGrid');
  statsGrid.innerHTML = '';
  
  // 통계 카드 생성
  statsGrid.appendChild(createStatCard('총 작업 건수', stats.totalCount, 'primary'));
  statsGrid.appendChild(createStatCard('총 렌탈 수량', stats.totalRental, 'success'));
  statsGrid.appendChild(createStatCard('참여 협력사', stats.companyCount, 'info'));
  statsGrid.appendChild(createStatCard('작업 구역', stats.zoneCount, 'warning'));
}

// 테이블 표시 업데이트
function updateTableDisplay(logs) {
  const tableBody = document.getElementById('tableBody');
  const emptyMessage = document.getElementById('emptyMessage');
  
  tableBody.innerHTML = '';
  
  if (logs.length === 0) {
    emptyMessage.style.display = 'block';
    return;
  }
  
  emptyMessage.style.display = 'none';
  
  logs.forEach(log => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${formatTime(log.timestamp)}</td>
      <td><span style="color: ${COMPANY_COLORS[log.company] || '#666'}">${log.company}</span></td>
      <td>ZONE ${log.zone}</td>
      <td>${log.floor}</td>
      <td>${log.detailPlace || '-'}</td>
      <td>${log.content}</td>
      <td>${formatNumber(log.rentalCount)}</td>
      <td>${log.editorEmail || '-'}</td>
    `;
    tableBody.appendChild(tr);
  });
}

// 현장 지도 데이터 로드
async function loadMapData() {
  const mapDate = document.getElementById('mapDate').value;
  const mapCompany = document.getElementById('mapCompany').value;
  
  if (!mapDate) {
    showToast('날짜를 선택해 주세요.', 'warning');
    return;
  }
  
  try {
    // 통계 데이터 가져오기
    const stats = await getStatsByDate(mapDate);
    
    // 협력사 필터링
    let filteredStats = stats.byZone;
    if (mapCompany) {
      filteredStats = {};
      Object.keys(stats.byZone).forEach(zone => {
        if (stats.byZone[zone].companies.includes(mapCompany)) {
          filteredStats[zone] = stats.byZone[zone];
        }
      });
    }
    
    // 지도 마커 업데이트
    updateMapMarkers(filteredStats);
    
    // 범례 업데이트
    updateMapLegend(filteredStats);
  } catch (error) {
    console.error('지도 데이터 로드 오류:', error);
    showToast('지도 데이터 로드에 실패했습니다.', 'error');
  }
}

// 지도 마커 업데이트
function updateMapMarkers(zoneStats) {
  const markersContainer = document.getElementById('zoneMarkers');
  markersContainer.innerHTML = '';
  
  Object.keys(ZONE_POSITIONS).forEach(zone => {
    const count = zoneStats[zone]?.count || 0;
    const position = ZONE_POSITIONS[zone];
    const marker = createZoneMarker(zone, count, position);
    
    // 마커 클릭 이벤트
    marker.addEventListener('click', () => {
      const companies = zoneStats[zone]?.companies || [];
      const rental = zoneStats[zone]?.rental || 0;
      showToast(
        `ZONE ${zone}: ${count}건, ${formatNumber(rental)}개 (${companies.join(', ') || '작업 없음'})`,
        count > 0 ? 'info' : 'warning'
      );
    });
    
    markersContainer.appendChild(marker);
  });
}

// 지도 범례 업데이트
function updateMapLegend(zoneStats) {
  const legendGrid = document.getElementById('zoneLegend');
  legendGrid.innerHTML = '';
  
  Object.keys(ZONE_BUILDINGS).forEach(zone => {
    const count = zoneStats[zone]?.count || 0;
    const companies = zoneStats[zone]?.companies || [];
    const building = ZONE_BUILDINGS[zone];
    
    const legendItem = createLegendItem(zone, building, count, companies);
    legendGrid.appendChild(legendItem);
  });
}

// 페이지 언로드시 정리
window.addEventListener('beforeunload', () => {
  if (unsubscribe) {
    unsubscribe();
  }
});

// 네트워크 상태 모니터링
window.addEventListener('online', () => {
  showToast('온라인 상태로 전환되었습니다.', 'success');
  loadViewData(); // 데이터 재동기화
});

window.addEventListener('offline', () => {
  showToast('오프라인 상태입니다. 일부 기능이 제한될 수 있습니다.', 'warning');
});

// 에러 핸들링
window.addEventListener('unhandledrejection', event => {
  console.error('Unhandled promise rejection:', event.reason);
  showToast('예기치 않은 오류가 발생했습니다.', 'error');
});
