// 상수 정의
export const FIXED_COMPANIES = [
  '다원건설', 
  '대양건설', 
  '동승전기', 
  '유앤테크', 
  '이케이네이션', 
  '다인공영'
];

// 층수 옵션 생성
export function getFloorOptions() {
  const floors = [];
  for (let i = 3; i >= 1; i--) {
    floors.push(`B${i}F`);
  }
  for (let i = 1; i <= 25; i++) {
    floors.push(`${i}F`);
  }
  return floors;
}

// 존(ZONE)별 동(棟) 정보
export const ZONE_BUILDINGS = {
  '1': '101동',
  '2': '101-102동 사이',
  '3': '102동',
  '4': '101-104동 사이',
  '5': '1블럭 중앙',
  '6': '102-103동 사이',
  '7': '104동',
  '8': '103-104동 사이',
  '9': '103동',
  '10': '201동',
  '11': '201-202동 사이',
  '12': '202동',
  '13': '201-204동 사이',
  '14': '2블럭 중앙',
  '15': '202-203동 사이',
  '16': '204동',
  '17': '203-204동 사이',
  '18': '203동',
};

// ZONE 위치 좌표 (현장 지도상 위치)
export const ZONE_POSITIONS = {
  // 왼쪽 상단 구역 (101동~109동)
  '1': { left: 17, top: 23 },   // 101동
  '2': { left: 27, top: 23 },   // 101-102동 사이
  '3': { left: 37, top: 23 },   // 102동
  '4': { left: 14, top: 38 },   // 101-104동 사이
  '5': { left: 27, top: 38 },   // 1블럭 중앙
  '6': { left: 40, top: 38 },   // 102-103동 사이
  '7': { left: 17, top: 53 },   // 104동
  '8': { left: 27, top: 53 },   // 103-104동 사이
  '9': { left: 37, top: 53 },   // 103동
  
  // 오른쪽 하단 구역 (201동~209동)
  '10': { left: 58, top: 57 },  // 201동
  '11': { left: 68, top: 57 },  // 201-202동 사이
  '12': { left: 78, top: 57 },  // 202동
  '13': { left: 58, top: 72 },  // 201-204동 사이
  '14': { left: 68, top: 72 },  // 2블럭 중앙
  '15': { left: 78, top: 72 },  // 202-203동 사이
  '16': { left: 58, top: 87 },  // 204동
  '17': { left: 68, top: 87 },  // 203-204동 사이
  '18': { left: 78, top: 87 },  // 203동
};

// 컬렉션 이름
export const COLLECTION_NAMES = {
  RENTAL_LOGS: 'rental_logs',
  SETTINGS: 'settings',
  IMAGES: 'images'
};

// 기본 설정
export const DEFAULT_SETTINGS = {
  maxRentalCount: 100,
  allowAnonymous: true,
  requireApproval: false
};

// 날짜 포맷 함수
export function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 시간 포맷 함수
export function formatTime(timestamp) {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

// 오늘 날짜 가져오기
export function getToday() {
  return formatDate(new Date());
}

// 색상 팔레트
export const COLORS = {
  primary: '#2563eb',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  gray: '#64748b'
};

// 협력사별 색상
export const COMPANY_COLORS = {
  '다원건설': '#2563eb',
  '대양건설': '#10b981',
  '동승전기': '#f59e0b',
  '유앤테크': '#ef4444',
  '이케이네이션': '#8b5cf6',
  '다인공영': '#ec4899'
};
