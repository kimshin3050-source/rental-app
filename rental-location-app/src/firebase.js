// Firebase configuration
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  enableIndexedDbPersistence,
  enableNetwork,
  disableNetwork 
} from 'firebase/firestore';
import { 
  getAuth, 
  signInAnonymously,
  onAuthStateChanged 
} from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Firebase 설정 (환경변수 사용)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Firestore 초기화
export const db = getFirestore(app);

// Authentication 초기화
export const auth = getAuth(app);

// Storage 초기화
export const storage = getStorage(app);

// 오프라인 지원 활성화
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('오프라인 지원을 활성화할 수 없습니다. 여러 탭이 열려있을 수 있습니다.');
  } else if (err.code === 'unimplemented') {
    console.warn('현재 브라우저에서 오프라인 지원을 사용할 수 없습니다.');
  }
});

// 네트워크 상태 관리
let isOnline = navigator.onLine;

window.addEventListener('online', async () => {
  isOnline = true;
  await enableNetwork(db);
  console.log('온라인 모드로 전환되었습니다.');
});

window.addEventListener('offline', async () => {
  isOnline = false;
  await disableNetwork(db);
  console.log('오프라인 모드로 전환되었습니다.');
});

// 익명 로그인 처리
export async function initAuth() {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        resolve(user);
      } else {
        try {
          const credential = await signInAnonymously(auth);
          resolve(credential.user);
        } catch (error) {
          console.error('인증 실패:', error);
          reject(error);
        }
      }
    });
  });
}

// 네트워크 상태 확인
export function getNetworkStatus() {
  return isOnline;
}

export default app;
