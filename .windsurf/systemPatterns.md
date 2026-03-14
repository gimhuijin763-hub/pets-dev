# System Patterns

## 프로젝트 구조

```
pets-dev/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # 루트 (랜딩 페이지 re-export)
│   ├── layout.tsx                # 전역 레이아웃 (헤더, 푸터)
│   ├── globals.css               # 전역 스타일 (Tailwind, 커스텀 컴포넌트)
│   ├── landing/
│   │   └── page.tsx              # 랜딩 페이지 (서비스 소개)
│   ├── animals/
│   │   ├── page.tsx              # 동물 목록 페이지
│   │   └── [id]/
│   │       ├── page.tsx          # 동물 상세 페이지
│   │       └── apply/
│   │           └── page.tsx      # 입양 신청 폼
│   ├── admin/
│   │   └── page.tsx              # 관리자 신청 관리 페이지
│   └── api/
│       ├── animals/              # 공개 조회 API
│       ├── applications/         # 신청 CRUD API
│       └── admin/                # 관리자 로그인/로그아웃
├── components/
│   ├── AnimalCard.tsx            # 동물 카드 컴포넌트
│   ├── StatusBadge.tsx           # 상태 뱃지 컴포넌트
│   └── layout/
│       └── Header.tsx            # 헤더 네비게이션
├── lib/
│   ├── supabase.ts               # 클라이언트 Supabase
│   ├── supabaseServer.ts         # 서버 전용 Supabase 클라이언트
│   └── adminAuth.ts              # 관리자 쿠키 인증 유틸
├── types/
│   └── index.ts                  # TypeScript 타입 정의
├── utils/
│   └── supabase-storage.ts       # API 호출 래퍼
├── supabase/
│   └── migrations/               # DB 마이그레이션
├── public/                       # 정적 파일 (favicon 등)
├── .windsurf/                    # 프로젝트 문서
├── .env.local                    # 환경변수 (Supabase + 관리자 인증)
├── package.json                  # 의존성 관리
├── tailwind.config.js            # Tailwind 설정
└── tsconfig.json                 # TypeScript 설정
```

## 아키텍처 패턴

### 1. 파일 기반 라우팅 (Next.js App Router)
- `app/` 디렉토리 구조가 URL 경로와 1:1 매핑
- 동적 라우팅: `[id]` 폴더로 파라미터 처리
- 레이아웃 중첩: `layout.tsx`로 공통 UI 구성

### 2. 클라이언트 사이드 렌더링
- 모든 페이지 컴포넌트에 `'use client'` 지시어 사용
- React Hooks (useState, useEffect, useCallback) 활용
- API Route Handler를 통한 서버 데이터 접근

### 3. 컴포넌트 기반 설계
- **Presentational Components**: AnimalCard, StatusBadge
- **Container Components**: 각 페이지 컴포넌트
- **Layout Components**: Header, RootLayout

### 4. 데이터 흐름
```
페이지 컴포넌트 (fetch)
    ↓
API Route Handler (/app/api)
    ↓
Supabase (server role)
    ↓
Postgres
```

## 핵심 패턴

### 1. 데이터 관리 패턴
```typescript
// API 라우트 기반 조회
export async function getAnimals(): Promise<Animal[]> {
  const response = await fetch('/api/animals', { cache: 'no-store' })
  const payload = await response.json()
  return payload.data ?? []
}
```

### 2. 폼 유효성 검증 패턴
```typescript
function validate(): boolean {
  const newErrors: Partial<FormData> = {}
  if (!form.applicant_name.trim()) 
    newErrors.applicant_name = '이름을 입력해 주세요.'
  // ... 추가 검증
  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}
```

### 3. 상태 업데이트 패턴
```typescript
async function handleStatusChange(appId: string, status: ApplicationStatus) {
  setUpdating(appId)
  const result = await updateApplicationStatus(appId, status)
  if (result.ok) {
    setApplications((prev) => prev.map((a) => (a.id === appId ? { ...a, status } : a)))
  }
  setUpdating(null)
}
```

### 4. 관리자 인증 패턴
```typescript
const response = await fetch('/api/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ password }),
})
```

### 5. 이미지 Fallback 패턴
```typescript
<img
  src={animal.image_url}
  alt={animal.name}
  onError={(event) => {
    const target = event.currentTarget
    target.onerror = null
    target.src = 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1200&q=80'
  }}
/>
```

## 모듈 관계

### 의존성 그래프
```
app/page.tsx → app/landing/page.tsx
app/animals/page.tsx → components/AnimalCard.tsx → types/index.ts
app/animals/[id]/page.tsx → utils/supabase-storage.ts → app/api/animals
app/animals/[id]/apply/page.tsx → utils/supabase-storage.ts → app/api/applications
app/admin/page.tsx → utils/supabase-storage.ts → app/api/admin
components/layout/Header.tsx → next/navigation
```

### 공유 모듈
- **types/index.ts**: 모든 컴포넌트에서 사용하는 타입 정의
- **utils/supabase-storage.ts**: API 호출 래퍼
- **lib/supabaseServer.ts**: 서버 전용 Supabase 클라이언트
- **components/StatusBadge.tsx**: 상태 표시 재사용 컴포넌트

## 스타일링 패턴

### Tailwind CSS 유틸리티 클래스
```css
/* globals.css에 정의된 커스텀 컴포넌트 */
.btn-primary { @apply inline-flex items-center ... }
.btn-secondary { @apply inline-flex items-center ... }
.card { @apply rounded-2xl bg-white ... }
.input { @apply w-full rounded-xl ... }
.label { @apply block text-sm ... }
.section-title { @apply text-2xl font-extrabold ... }
```

### 반응형 디자인
- 모바일 우선 (기본 스타일)
- `sm:` (640px+), `md:` (768px+), `lg:` (1024px+) 브레이크포인트
- Grid 레이아웃: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`

## 네이밍 컨벤션

### 파일명
- 페이지: `page.tsx`
- 레이아웃: `layout.tsx`
- 컴포넌트: PascalCase (예: `AnimalCard.tsx`)
- 유틸리티: camelCase (예: `storage.ts`)

### 변수/함수명
- 컴포넌트: PascalCase (예: `AnimalCard`)
- 함수: camelCase (예: `getAnimals`)
- 상수: UPPER_SNAKE_CASE (예: `SEED_ANIMALS`)
- 타입/인터페이스: PascalCase (예: `Animal`, `Application`)

### CSS 클래스
- Tailwind 유틸리티 우선
- 커스텀 클래스: kebab-case (예: `btn-primary`)

## 에러 처리 패턴

### 1. 데이터 로드 실패
```typescript
if (!response.ok) {
  return []
}
```

### 2. 라우팅 가드
```typescript
const found = await getAnimalById(id)
if (!found) {
  router.push('/animals')
  return
}
```

### 3. 폼 검증
```typescript
if (!validate()) return
// 제출 로직
```

## 상태 관리 전략

### Local State (useState)
- 페이지별 독립적인 상태
- 폼 입력값, 로딩 상태, 에러 메시지

### Persistent State (Supabase)
- animals 테이블
- applications 테이블

### Derived State
- 필터링된 목록 (계산된 값)
- 통계 카운트 (계산된 값)

## 성능 최적화 패턴

### 1. useCallback 메모이제이션
```typescript
const load = useCallback(async () => {
  const appsResponse = await getApplications()
  setApplications(appsResponse.data)
}, [])
```

### 2. 조건부 렌더링
```typescript
{filtered.length === 0 ? (
  <EmptyState />
) : (
  <List items={filtered} />
)}
```

### 3. 지연 업데이트 (UX)
```typescript
setUpdating(appId)
await updateApplicationStatus(appId, status)
setUpdating(null)
```
