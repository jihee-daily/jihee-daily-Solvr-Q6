# Deep Sleep - 수면 관리 서비스

![Deep Sleep](https://img.shields.io/badge/Deep_Sleep-수면_관리_서비스-orange)

Deep Sleep은 수면 패턴을 추적하고 관리하는 데 도움을 주는 애플리케이션입니다.

## 주요 기능

### 1. 수면 기록 관리
- 취침 시간과 기상 시간 기록
- 수면 품질 평가 (1-10점)
- 특이사항 메모 기능

### 2. 직관적인 UI/UX
- 깔끔하고 모던한 디자인
- 반응형 웹 디자인
- 사용자 친화적인 인터페이스

## 사용 방법

1. 메인 화면에서 '새 기록 추가' 버튼 클릭
2. 취침 시간과 기상 시간 입력
3. 수면 품질 선택 (1-10점)
4. 특이사항이 있다면 메모 작성
5. 저장하기 버튼 클릭

## 주요 화면

### 메인 화면
- 수면 기록 목록 확인
- 새 기록 추가 버튼
- 기록 수정/삭제 기능

### 기록 입력/수정 화면
- 날짜 및 시간 선택
- 수면 품질 평가
- 특이사항 메모


## 기술 스택

### 공통
- 패키지 매니저: pnpm
- TypeScript
- Node.js

### 프론트엔드
- React
- Chakra UI
- React Router
- Axios

### 백엔드
- Express
- TypeORM
- SQLite

## 시작하기

### 요구사항
- Node.js 14.0.0 이상
- pnpm 8.0.0 이상


### 설치 방법

1. 저장소 클론
```bash
git clone [repository-url]
cd deep-sleep
```

2. pnpm 설치 (없는 경우)
```bash
npm install -g pnpm
```

3. 의존성 설치
```bash
# 프로젝트 루트 디렉토리에서 모든 의존성 설치
pnpm install
```

4. 환경 설정
```bash
# 서버 포트 설정 (기본값: 8000)
# 클라이언트 포트 설정 (기본값: 3000)
```

5. 실행
```bash
# 개발 모드로 클라이언트와 서버 동시 실행
pnpm dev

# 또는 개별적으로 실행
# 서버 실행
pnpm dev:server

# 클라이언트 실행
pnpm dev:client
```
