@echo off
echo ===============================================
echo   렌탈작업 위치 공유 시스템 - 설치 도우미
echo ===============================================
echo.

REM Node.js 확인
echo [1/5] Node.js 확인 중...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ❌ Node.js가 설치되어 있지 않습니다!
    echo 👉 https://nodejs.org 에서 LTS 버전을 다운로드하여 설치하세요.
    echo.
    pause
    exit /b 1
) else (
    echo ✅ Node.js 설치 확인됨
    node --version
)

REM npm 확인
echo.
echo [2/5] npm 확인 중...
call npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm을 찾을 수 없습니다!
    pause
    exit /b 1
) else (
    echo ✅ npm 설치 확인됨
    call npm --version
)

REM Firebase CLI 설치 확인
echo.
echo [3/5] Firebase CLI 확인 중...
call firebase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️ Firebase CLI가 설치되어 있지 않습니다.
    echo 설치하시겠습니까? (Y/N)
    set /p install_firebase=
    if /i "%install_firebase%"=="Y" (
        echo Firebase CLI 설치 중...
        call npm install -g firebase-tools
    )
) else (
    echo ✅ Firebase CLI 설치 확인됨
    call firebase --version
)

REM 의존성 설치
echo.
echo [4/5] 프로젝트 의존성 설치 중...
echo 이 작업은 몇 분 정도 소요될 수 있습니다...
call npm install

if %errorlevel% neq 0 (
    echo.
    echo ❌ 의존성 설치 실패!
    echo 네트워크 연결을 확인하고 다시 시도하세요.
    pause
    exit /b 1
) else (
    echo ✅ 의존성 설치 완료!
)

REM .env 파일 생성 안내
echo.
echo [5/5] 환경 설정 파일 확인 중...
if not exist .env (
    echo.
    echo ⚠️ .env 파일이 없습니다!
    echo.
    echo Firebase Console에서 프로젝트 설정 정보를 가져와서
    echo .env 파일을 생성해야 합니다.
    echo.
    echo 1. .env.example 파일을 .env로 복사하세요
    echo 2. Firebase Console에서 설정 정보를 입력하세요
    echo.
    copy .env.example .env >nul 2>&1
    echo 📝 .env 파일이 생성되었습니다. 
    echo    메모장으로 열어서 Firebase 설정을 입력하세요.
    echo.
    notepad .env
) else (
    echo ✅ .env 파일 존재 확인됨
)

echo.
echo ===============================================
echo   ✨ 설치가 완료되었습니다!
echo ===============================================
echo.
echo 다음 명령어로 개발 서버를 실행할 수 있습니다:
echo   npm run dev
echo.
echo Firebase에 배포하려면:
echo   1. firebase login (로그인)
echo   2. firebase init (프로젝트 연결)
echo   3. npm run build (빌드)
echo   4. firebase deploy (배포)
echo.
pause
