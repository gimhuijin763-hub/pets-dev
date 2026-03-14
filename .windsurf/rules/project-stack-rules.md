---
trigger: manual
---
# Project Stack Rules

## 공통 기술 규칙
- 가능하면 TypeScript를 우선 사용한다.
- 타입 안정성을 우선한다.
- 공통 타입은 재사용 가능하게 분리한다.
- any 사용은 지양한다.
- 환경 변수는 루트 `.env*` 파일로 관리하고 민감 정보는 커밋하지 않는다.
- 상수는 `UPPER_SNAKE_CASE`, 타입/인터페이스/클래스는 `PascalCase`, 변수/함수는 각 언어 관례를 따른다.

---

## Next.js Rules

### 라우팅
- Next.js 프로젝트는 App Router를 우선 사용한다.
- Pages Router는 기존 프로젝트에서만 유지보수 목적으로 다룬다.

### API 구현
- API 엔드포인트는 Route Handler를 우선 사용한다.
- 인증, DB 처리, 외부 API 호출, 권한 체크 등 서버 로직은 Route Handler 또는 서버 전용 계층에서 처리한다.
- Server Action은 단순 폼 처리나 제한된 서버 액션에만 사용한다.

### 프로젝트 구조
- 특별한 사유가 없으면 `src/` 없이 루트 기준 구조를 사용한다.
- 공통 UI는 `components/`
- 페이지 전용 컴포넌트는 해당 route 폴더 근처에 둔다.
- 공통 훅은 `hooks/`
- 공통 타입은 `types/`
- 공통 유틸은 `utils/` 또는 `lib/`

### UI 원칙
- UI 라이브러리 사용 여부는 현재 프로젝트 규칙을 우선한다.
- 특정 UI 라이브러리(예: ShadCN)는 프로젝트에서 이미 채택된 경우에만 따른다.
- 프로젝트에 해당 규칙이 명시되지 않았다면 기존 코드 스타일과 컴포넌트 패턴을 따른다.

### 렌더링 원칙
- SEO, 초기 로딩, 데이터 민감도에 따라 SSR/SSG/CSR를 적절히 선택한다.
- 클라이언트 컴포넌트는 꼭 필요한 경우에만 사용한다.
- 데이터 fetch 위치는 컴포넌트 책임에 맞게 분리한다.

---

## Supabase Rules

### 인증
- 인증은 Supabase Auth를 우선 사용한다.
- 세션 처리, 권한, 사용자 식별은 서버/클라이언트 역할에 맞게 분리한다.

### 데이터 접근
- Supabase 사용 시 RLS 정책을 기본 전제로 설계한다.
- 테이블 구조, 정책, 함수, 스토리지는 문서화한다.
- DB 스키마 변경 시 관련 문서와 마이그레이션 내역을 함께 관리한다.

### 구현 원칙
- 인증 로직과 데이터 접근 로직을 UI에 과도하게 섞지 않는다.
- 에러 메시지는 사용자용과 개발자용을 구분한다.
- 공개/비공개 데이터 경계를 명확히 둔다.

---

## FastAPI Rules

### 구조
- FastAPI 프로젝트는 `app/` 패키지 기준으로 구조화한다.
- 라우터, 스키마, 서비스, 코어 설정을 분리한다.
- 비즈니스 로직은 endpoint에 직접 과도하게 작성하지 않는다.

### 데이터 모델
- 소규모/중간 규모 프로젝트에서는 FastAPI + Prisma 또는 SQLAlchemy 계열을 프로젝트 기준에 맞게 사용한다.
- 스키마와 응답 모델을 명확히 분리한다.

### API 설계
- request/response schema를 명확히 정의한다.
- 상태 코드와 예외 처리를 일관되게 유지한다.
- 의존성 주입 패턴을 활용한다.

---

## Django Rules

### 구조
- Django 프로젝트는 설정, 앱, 공통 기능을 분리한다.
- 환경별 settings 분리를 우선한다.
- 공통 로직은 core/common 계층으로 분리한다.

### API
- 대규모 또는 복잡한 백엔드는 Django + DRF를 우선 고려한다.
- Serializer, View, Permission, Service 책임을 분리한다.
- View에 비즈니스 로직을 과도하게 넣지 않는다.

### 모델/ORM
- Django ORM 기본 패턴을 존중한다.
- 공통 추상 모델, 타임스탬프, soft delete 여부 등은 프로젝트 정책에 맞춘다.

---

## TypeScript / Frontend Convention

### 네이밍
- 컴포넌트 파일명: `PascalCase`
- 일반 모듈 파일명: `camelCase` 또는 프로젝트 규칙
- 함수명: `camelCase`
- 이벤트 핸들러: `handle` 접두사
- boolean 변수: `is`, `has`, `can` 접두사 권장

### 타입
- 객체 구조에는 interface 우선
- 유니언/조합형에는 type 사용 가능
- Props 타입에는 `Props` 접미사 사용
- any 지양
- strict mode를 전제로 작성

### React
- 함수형 컴포넌트 사용
- 불필요한 상태는 만들지 않는다
- UI 상태와 서버 상태를 분리한다
- 재사용되지 않는 컴포넌트는 너무 이른 공통화하지 않는다

---

## 문서 반영 규칙
- 기술 스택 관련 결정이 바뀌면 `techContext.md`를 갱신한다.
- 구조 패턴이 바뀌면 `systemPatterns.md`를 갱신한다.
- 현재 진행 내용이 바뀌면 `activeContext.md`, `progress.md`를 갱신한다.
