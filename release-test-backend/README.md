# 🚀 Release Test Backend

Spring Boot 기반의 Todo 관리 플랫폼 백엔드 API 서버입니다.

## 🛠️ 기술 스택

- **Framework**: Spring Boot 3.5.4
- **Language**: Java 17
- **Database**: MySQL 8.0+
- **Authentication**: JWT + OAuth2 (카카오, 네이버, 구글)
- **Build Tool**: Gradle
- **ORM**: Spring Data JPA

## 📦 설치 및 실행

### 1. 사전 요구사항
- Java 17+
- MySQL 8.0+
- Gradle (또는 ./gradlew 사용)

### 2. 데이터베이스 설정
MySQL에서 데이터베이스를 생성합니다:
```sql
CREATE DATABASE release_test;
```

### 3. 환경 변수 설정
`.env.example` 파일을 복사하여 `.env` 파일을 생성하고 실제 값을 입력합니다:

```bash
cp .env.example .env
```

`.env` 파일에서 다음 값들을 수정하세요:
- `SPRING_DATASOURCE_USERNAME`: MySQL 사용자명
- `SPRING_DATASOURCE_PASSWORD`: MySQL 비밀번호
- `JWT_SECRET_KEY`: JWT 토큰 암호화를 위한 비밀키 (64자 이상 권장)
- `KAKAO_CLIENT_ID`: 카카오 개발자 콘솔에서 발급받은 클라이언트 ID
- `GOOGLE_CLIENT_ID`: 구글 개발자 콘솔에서 발급받은 클라이언트 ID
- `GOOGLE_CLIENT_SECRET`: 구글 개발자 콘솔에서 발급받은 클라이언트 시크릿
- `NAVER_CLIENT_ID`: 네이버 개발자 센터에서 발급받은 클라이언트 ID
- `NAVER_CLIENT_SECRET`: 네이버 개발자 센터에서 발급받은 클라이언트 시크릿

### 4. 애플리케이션 실행

```bash
# 개발 모드로 실행
./gradlew bootRun

# 또는 JAR 파일 빌드 후 실행
./gradlew build
java -jar build/libs/release-test-backend-0.0.1-SNAPSHOT.jar
```

서버가 `http://localhost:8080`에서 실행됩니다.

## 🔑 OAuth2 설정

### 카카오 로그인 설정
1. [Kakao Developers](https://developers.kakao.com/)에서 애플리케이션 등록
2. 플랫폼 설정에서 Web 플랫폼 추가 (`http://localhost:8080`)
3. Redirect URI 설정: `http://localhost:8080/kakao-authentication/login`
4. 동의항목에서 필요한 정보 설정 (닉네임, 이메일 등)

### 구글 로그인 설정
1. [Google Cloud Console](https://console.cloud.google.com/)에서 프로젝트 생성
2. OAuth 2.0 클라이언트 ID 생성
3. 승인된 리디렉션 URI 설정: `http://localhost:8080/google-authentication/login`

### 네이버 로그인 설정
1. [네이버 개발자 센터](https://developers.naver.com/)에서 애플리케이션 등록
2. 서비스 URL: `http://localhost:8080`
3. Callback URL: `http://localhost:8080/naver-authentication/login`

## 📚 API 문서

### 주요 엔드포인트

#### 인증 관련
- `GET /kakao-authentication/login` - 카카오 로그인 콜백
- `GET /google-authentication/login` - 구글 로그인 콜백  
- `GET /naver-authentication/login` - 네이버 로그인 콜백

#### Todo 관리
- `GET /api/todos/{date}` - 특정 날짜의 할 일 목록 조회
- `POST /api/todos` - 새 할 일 생성
- `PUT /api/todos/{id}` - 할 일 수정
- `DELETE /api/todos/{id}` - 할 일 삭제
- `PATCH /api/todos/{id}/toggle` - 할 일 완료 상태 토글

#### 캘린더 이벤트
- `GET /api/calendar/events` - 모든 캘린더 이벤트 조회
- `POST /api/calendar/events` - 새 이벤트 생성
- `PUT /api/calendar/events/{id}` - 이벤트 수정
- `DELETE /api/calendar/events/{id}` - 이벤트 삭제

#### 대시보드
- `GET /api/dashboard` - 대시보드 데이터 조회

## 🗂️ 프로젝트 구조

```
src/main/java/sp/releasetestbackend/
├── account/              # 계정 관리
├── account_profile/      # 사용자 프로필
├── calendar/            # 캘린더 이벤트
├── config/              # 설정 파일
├── dashboard/           # 대시보드 API
├── googleLogin/         # 구글 로그인
├── home/                # Todo 관리 (메인 기능)
├── jwt/                 # JWT 토큰 관리
├── kakaoLogin/          # 카카오 로그인
└── naverLogin/          # 네이버 로그인
```

## 🔧 개발 도구

```bash
# 개발 모드 실행
./gradlew bootRun

# 테스트 실행
./gradlew test

# 빌드
./gradlew build

# 린트 및 포맷팅
./gradlew checkstyleMain
```

## 🛡️ 보안 주의사항

- `.env` 파일은 절대 Git에 커밋하지 마세요
- JWT 비밀키는 충분히 복잡하게 설정하세요 (64자 이상)
- 프로덕션 환경에서는 HTTPS를 사용하세요
- OAuth2 클라이언트 시크릿은 안전하게 보관하세요

## 📝 라이선스

이 프로젝트는 개인 학습 목적으로 제작되었습니다.