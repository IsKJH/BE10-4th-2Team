# 📋 지건컴퍼니 - Todo Management Platform

BE10 4기 2팀의 할 일 관리 플랫폼입니다. 사용자의 생산성 향상을 위한 직관적이고 효율적인 Todo 관리 시스템을 제공합니다.

## 🚀 프로젝트 개요

지건컴퍼니는 개인 및 팀의 업무 관리를 위한 웹 애플리케이션으로, 할 일 관리, 캘린더 기능, 대시보드를 통한 생산성 분석 등을 제공합니다.

### 주요 기능

- 📝 **할 일 관리**: 우선순위별 할 일 생성, 수정, 삭제, 완료 처리
- 📊 **대시보드**: 실시간 진행률, 주간 업무 비교 차트, 통계 분석
- 📅 **캘린더**: 일정 관리, 이벤트 생성, 월별 뷰
- 🔐 **소셜 로그인**: 카카오, 네이버, 구글 연동 로그인
- 📱 **반응형 디자인**: 데스크톱, 태블릿, 모바일 지원
- 🎨 **직관적 UI/UX**: 현대적이고 사용하기 쉬운 인터페이스

## 🏗️ 프로젝트 구조

```
BE10-4th-2Team/
├── release-test-frontend/     # React + TypeScript 프론트엔드
│   ├── src/
│   │   ├── home/             # 메인 기능 (Todo, 대시보드, 캘린더)
│   │   ├── auth/             # 인증 관련 컴포넌트
│   │   └── shared/           # 공통 컴포넌트 및 유틸리티
│   └── package.json
└── release-test-backend/      # Spring Boot 백엔드
    ├── src/main/java/sp/releasetestbackend/
    │   ├── account/          # 계정 관리
    │   ├── home/             # Todo 관리
    │   ├── calendar/         # 캘린더 이벤트
    │   ├── dashboard/        # 대시보드 API
    │   ├── googleLogin/      # 구글 로그인
    │   ├── kakaoLogin/       # 카카오 로그인
    │   ├── naverLogin/       # 네이버 로그인
    │   └── jwt/              # JWT 토큰 관리
    └── build.gradle
```

## 🛠️ 기술 스택

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **Styling**: Tailwind CSS + Custom CSS
- **HTTP Client**: Axios
- **Icons**: React Icons
- **Charts**: Recharts
- **Alerts**: SweetAlert2

### Backend
- **Framework**: Spring Boot 3.5.4
- **Language**: Java 17
- **Database**: MySQL
- **Authentication**: JWT + OAuth2 (카카오, 네이버, 구글)
- **Build Tool**: Gradle
- **ORM**: Spring Data JPA

## 📦 설치 및 실행

### 사전 요구사항
- Node.js 16+
- Java 17+
- MySQL 8.0+

### Frontend 실행

```bash
cd release-test-frontend
npm install
npm run dev
```

개발 서버가 `http://localhost:5173`에서 실행됩니다.

### Backend 실행

```bash
cd release-test-backend

# 환경변수 설정 (.env 파일 생성)
# DB_URL=jdbc:mysql://localhost:3306/release_test
# DB_USERNAME=your_username
# DB_PASSWORD=your_password
# JWT_SECRET=your_jwt_secret
# KAKAO_CLIENT_ID=your_kakao_client_id
# NAVER_CLIENT_ID=your_naver_client_id
# GOOGLE_CLIENT_ID=your_google_client_id

./gradlew bootRun
```

백엔드 서버가 `http://localhost:8080`에서 실행됩니다.

## 🌟 주요 화면

### 1. 대시보드
- 실시간 할 일 진행률
- 주간 업무 완료 비교 차트
- 캘린더 위젯
- 오늘의 할 일 목록

### 2. 할 일 관리
- 우선순위별 할 일 분류 (낮음, 보통, 높음)
- 완료/미완료 상태 관리
- 검색 및 필터링
- 실시간 진행률 표시

### 3. 캘린더
- 월별 캘린더 뷰
- 이벤트 생성 및 관리 (이벤트, 회의, 휴일)
- 일별 상세 이벤트 보기
- 대시보드 캘린더 위젯과 연동

### 4. 소셜 로그인
- 카카오, 네이버, 구글 계정으로 간편 로그인
- JWT 기반 인증
- 자동 회원가입

## 🔧 개발 도구

### Frontend 개발
```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 린트 검사
npm run lint

# 프리뷰 서버
npm run preview
```

### Backend 개발
```bash
# 개발 모드 실행
./gradlew bootRun

# 테스트 실행
./gradlew test

# 프로덕션 빌드
./gradlew build
```

## 📱 반응형 지원

- **Desktop**: 1024px 이상
- **Tablet**: 768px - 1023px
- **Mobile**: 767px 이하

모든 화면 크기에서 최적화된 사용자 경험을 제공합니다.

## 🤝 팀 정보

**BE10 4기 2팀**
- Frontend & Backend 개발
- UI/UX 디자인
- API 설계 및 구현

---
