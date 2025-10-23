// UI 유틸리티 함수들

// Toast 알림 표시
export function showToast(message, type = 'info', duration = 3000) {
  const toast = document.getElementById('toast');
  
  // 기존 클래스 제거
  toast.className = 'toast';
  
  // 타입별 클래스 추가
  if (type) {
    toast.classList.add(type);
  }
  
  toast.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// Loading 상태 토글
export function toggleLoading(element, isLoading) {
  if (isLoading) {
    element.classList.add('loading');
    element.disabled = true;
  } else {
    element.classList.remove('loading');
    element.disabled = false;
  }
}

// 폼 데이터 수집
export function getFormData(formElement) {
  const formData = new FormData(formElement);
  const data = {};
  
  for (let [key, value] of formData.entries()) {
    data[key] = value;
  }
  
  return data;
}

// 폼 리셋
export function resetForm(formElement) {
  formElement.reset();
  
  // Select 요소들의 첫 번째 옵션 선택
  const selects = formElement.querySelectorAll('select');
  selects.forEach(select => {
    select.selectedIndex = 0;
  });
}

// 테이블 행 생성
export function createTableRow(data) {
  const tr = document.createElement('tr');
  
  Object.values(data).forEach(value => {
    const td = document.createElement('td');
    td.textContent = value || '-';
    tr.appendChild(td);
  });
  
  return tr;
}

// 빈 메시지 표시/숨기기
export function toggleEmptyMessage(show, targetElement, message = '데이터가 없습니다.') {
  let emptyDiv = targetElement.querySelector('.empty-message');
  
  if (show) {
    if (!emptyDiv) {
      emptyDiv = document.createElement('div');
      emptyDiv.className = 'empty-message';
      emptyDiv.textContent = message;
      targetElement.appendChild(emptyDiv);
    }
    emptyDiv.style.display = 'block';
  } else {
    if (emptyDiv) {
      emptyDiv.style.display = 'none';
    }
  }
}

// Select 옵션 추가
export function populateSelect(selectElement, options, defaultText = '선택하세요') {
  // 기존 옵션 제거
  selectElement.innerHTML = '';
  
  // 기본 옵션 추가
  if (defaultText) {
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = defaultText;
    selectElement.appendChild(defaultOption);
  }
  
  // 옵션 추가
  options.forEach(option => {
    const optionElement = document.createElement('option');
    
    if (typeof option === 'object') {
      optionElement.value = option.value;
      optionElement.textContent = option.text;
    } else {
      optionElement.value = option;
      optionElement.textContent = option;
    }
    
    selectElement.appendChild(optionElement);
  });
}

// 숫자 포맷팅
export function formatNumber(number) {
  return new Intl.NumberFormat('ko-KR').format(number);
}

// 날짜 입력 필드에 오늘 날짜 설정
export function setTodayDate(inputElement) {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  inputElement.value = `${year}-${month}-${day}`;
}

// 탭 전환 처리
export function switchTab(tabName) {
  // 모든 탭 버튼과 패널 비활성화
  const allTabButtons = document.querySelectorAll('.tab-btn');
  const allTabPanels = document.querySelectorAll('.tab-panel');
  
  allTabButtons.forEach(btn => btn.classList.remove('active'));
  allTabPanels.forEach(panel => panel.classList.remove('active'));
  
  // 선택된 탭 활성화
  const selectedButton = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
  const selectedPanel = document.getElementById(`${tabName}Tab`);
  
  if (selectedButton) selectedButton.classList.add('active');
  if (selectedPanel) selectedPanel.classList.add('active');
}

// 통계 카드 생성
export function createStatCard(label, value, color = 'primary') {
  const card = document.createElement('div');
  card.className = 'stat-card';
  card.style.background = `linear-gradient(135deg, var(--${color}-color), var(--${color}-hover))`;
  
  card.innerHTML = `
    <div class="stat-label">${label}</div>
    <div class="stat-value">${formatNumber(value)}</div>
  `;
  
  return card;
}

// 구역 마커 생성
export function createZoneMarker(zone, count, position) {
  const marker = document.createElement('div');
  marker.className = 'zone-marker';
  marker.classList.add(count > 0 ? 'has-work' : 'no-work');
  marker.style.left = `${position.left}%`;
  marker.style.top = `${position.top}%`;
  marker.textContent = count > 0 ? count : '';
  marker.title = `ZONE ${zone}: ${count}건`;
  marker.dataset.zone = zone;
  
  return marker;
}

// 범례 아이템 생성
export function createLegendItem(zone, building, count, companies) {
  const item = document.createElement('div');
  item.className = 'legend-item';
  
  const color = document.createElement('div');
  color.className = 'legend-color';
  color.style.background = count > 0 ? 'var(--danger-color)' : 'var(--success-color)';
  
  const text = document.createElement('div');
  text.innerHTML = `
    <strong>ZONE ${zone}</strong> (${building})<br>
    <small>${count}건${companies ? ' - ' + companies.join(', ') : ''}</small>
  `;
  
  item.appendChild(color);
  item.appendChild(text);
  
  return item;
}

// 모달 생성 (필요시 사용)
export function createModal(title, content, onConfirm, onCancel) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <h3>${title}</h3>
      <div class="modal-body">${content}</div>
      <div class="modal-actions">
        <button class="btn btn-primary" id="modalConfirm">확인</button>
        <button class="btn btn-secondary" id="modalCancel">취소</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  document.getElementById('modalConfirm').addEventListener('click', () => {
    if (onConfirm) onConfirm();
    document.body.removeChild(modal);
  });
  
  document.getElementById('modalCancel').addEventListener('click', () => {
    if (onCancel) onCancel();
    document.body.removeChild(modal);
  });
  
  return modal;
}

// 디바운스 함수
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 스크롤 위치 저장/복원
export function saveScrollPosition(key) {
  localStorage.setItem(`scroll-${key}`, window.scrollY);
}

export function restoreScrollPosition(key) {
  const position = localStorage.getItem(`scroll-${key}`);
  if (position) {
    window.scrollTo(0, parseInt(position));
  }
}
