# 🚀 Windows 빠른 시작 가이드

## 📦 설치 방법 (5분 소요)

### 1️⃣ ZIP 파일 압축 해제
1. `rental-location-firebase.zip` 파일을 바탕화면에 압축 해제
2. `rental-location-app` 폴더가 생성됨

### 2️⃣ 자동 설치 실행
1. `rental-location-app` 폴더 열기
2. **`setup.bat`** 파일 더블클릭
3. 안내에 따라 진행

### 3️⃣ Firebase 설정
1. [Firebase Console](https://console.firebase.google.com) 접속
2. 프로젝트 → ⚙️ 설정 → 일반 → 내 앱 → 웹 앱
3. Firebase SDK 구성 복사
4. `.env` 파일에 붙여넣기 (setup.bat이 자동으로 열어줌)

```env
VITE_FIREBASE_API_KEY=여기에_apiKey_값
VITE_FIREBASE_AUTH_DOMAIN=여기에_authDomain_값
VITE_FIREBASE_PROJECT_ID=여기에_projectId_값
VITE_FIREBASE_STORAGE_BUCKET=여기에_storageBucket_값
VITE_FIREBASE_MESSAGING_SENDER_ID=여기에_messagingSenderId_값
VITE_FIREBASE_APP_ID=여기에_appId_값
```

### 4️⃣ 개발 서버 실행
```cmd
npm run dev
```
브라우저에서 http://localhost:3000 자동 열림

---

## 🔥 Firebase 서비스 활성화 체크리스트

### ✅ Firestore Database
1. Firebase Console → Firestore Database
2. "데이터베이스 만들기"
3. 프로덕션 모드로 시작
4. 위치: asia-northeast3 (서울)

### ✅ Authentication
1. Firebase Console → Authentication
2. "시작하기"
3. Sign-in method 탭
4. "익명" 활성화 (스위치 ON)

### ✅ Storage (선택사항)
1. Firebase Console → Storage
2. "시작하기"
3. 기본 규칙으로 시작

---

## 🚀 배포하기

### 명령 프롬프트(CMD)에서:
```cmd
# 1. Firebase 로그인
firebase login

# 2. 프로젝트 초기화
firebase init
```

### firebase init 선택 옵션:
- Firestore: `Y` (Enter)
- Hosting: `스페이스바로 선택` → Enter
- Use existing project → `본인 프로젝트 선택`
- Firestore rules: Enter (기본값)
- Firestore indexes: Enter (기본값)
- Public directory: `dist` 입력
- Single-page app: `Y`
- GitHub Actions: `N`

### 배포:
```cmd
# 빌드 & 배포
npm run build
firebase deploy
```

---

## ❓ 자주 발생하는 문제

### 🔧 npm install 오류
```cmd
# 캐시 삭제 후 재설치
npm cache clean --force
npm install
```

### 🔧 Firebase 명령어를 찾을 수 없음
```cmd
# Firebase CLI 재설치
npm install -g firebase-tools
```

### 🔧 .env 파일이 적용 안 됨
1. `.env` 파일이 프로젝트 루트에 있는지 확인
2. 개발 서버 재시작 (Ctrl+C → npm run dev)

### 🔧 Firestore 권한 오류
개발 중에는 `firestore.rules` 수정:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
⚠️ 운영 환경에서는 보안 규칙 필수!

---

## 📞 도움이 필요하신가요?

각 단계별로 막히는 부분이 있으면 에러 메시지와 함께 문의해 주세요!
