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

// ZONE 위치 좌표 (실제 현장 지도 기준)
export const ZONE_POSITIONS = {
  // 1블럭 (왼쪽 상단)
  '1': { left: 18, top: 25 },   // 101동
  '2': { left: 35, top: 20 },   // 101-102동 사이
  '3': { left: 52, top: 25 },   // 102동
  '4': { left: 18, top: 42 },   // 101-104동 사이
  '5': { left: 35, top: 42 },   // 1블럭 중앙
  '6': { left: 52, top: 42 },   // 102-103동 사이
  '7': { left: 18, top: 59 },   // 104동
  '8': { left: 35, top: 59 },   // 103-104동 사이
  '9': { left: 52, top: 59 },   // 103동
  
  // 2블럭 (오른쪽 하단)
  '10': { left: 73, top: 25 },  // 201동
  '11': { left: 82, top: 25 },  // 201-202동 사이
  '12': { left: 91, top: 25 },  // 202동
  '13': { left: 73, top: 50 },  // 201-204동 사이
  '14': { left: 82, top: 50 },  // 2블럭 중앙
  '15': { left: 91, top: 50 },  // 202-203동 사이
  '16': { left: 73, top: 75 },  // 204동
  '17': { left: 82, top: 75 },  // 203-204동 사이
  '18': { left: 91, top: 75 },  // 203동
};

// 나머지 기존 내용들 (색상, 함수 등)은 그대로 유지
export const COLLECTION_NAMES = {
  RENTAL_LOGS: 'rental_logs',
  SETTINGS: 'settings',
  IMAGES: 'images'
};

export const DEFAULT_SETTINGS = {
  maxRentalCount: 100,
  allowAnonymous: true,
  requireApproval: false
};

export function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatTime(timestamp) {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function getToday() {
  return formatDate(new Date());
}

export const COLORS = {
  primary: '#2563eb',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  gray: '#64748b'
};

export const COMPANY_COLORS = {
  '다원건설': '#2563eb',
  '대양건설': '#10b981',
  '동승전기': '#f59e0b',
  '유앤테크': '#ef4444',
  '이케이네이션': '#8b5cf6',
  '다인공영': '#ec4899'
};
