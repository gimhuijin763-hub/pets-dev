# Tech Context

## 기술 스택

### 프론트엔드
- **Next.js 14.2.28**: React 기반 풀스택 프레임워크
  - App Router 사용 (파일 기반 라우팅)
  - Server Components 미사용 (모든 컴포넌트 'use client')
- **React 18**: UI 라이브러리
  - Hooks 기반 상태 관리 (useState, useEffect, useCallback)
- **TypeScript 5**: 정적 타입 시스템
  - 엄격한 타입 체크
  - 인터페이스 기반 데이터 모델링

### 스타일링
- **Tailwind CSS 3.3.0**: 유틸리티 우선 CSS 프레임워크
  - 커스텀 컴포넌트 클래스 정의 (btn-primary, card 등)
  - 반응형 디자인 (모바일 우선)
- **PostCSS 8**: CSS 후처리
- **Autoprefixer 10**: 브라우저 호환성

### 아이콘
- **lucide-react 0.468.0**: React 아이콘 라이브러리
  - 사용 아이콘: PawPrint, ArrowLeft, Heart, Calendar, User, Tag, CheckCircle, ClipboardList, RefreshCw, Sparkles 등

### 개발 도구
- **Node.js**: 런타임 환경
- **npm**: 패키지 매니저

## 외부 연동

### 현재 연동
- **Unsplash**: 동물 이미지 호스팅 (외부 URL)
  - 시드 데이터에 Unsplash 이미지 URL 하드코딩
  - 이미지 로드 실패 시 fallback 이미지 사용
- **Supabase**: PostgreSQL 기반 BaaS (Backend as a Service)
  - API Route Handler 기반 서버 연동 완료
  - `animals`, `applications` 테이블 사용
  - RLS 정책 적용 (applications는 insert만 공개)
  - 관리자 인증 쿠키 기반 보호

## 데이터 저장소

### 현재: Supabase
```typescript
interface Animal {
  id: string
  name: string
  type: string
  age: string
  gender: '남' | '여'
  description: string
  image_url: string
  adoption_status: AdoptionStatus
}

interface Application {
  id: string
  animal_id: string
  applicant_name: string
  phone: string
  email: string
  reason: string
  status: ApplicationStatus
  created_at: string
}
```

```sql
-- animals 테이블
CREATE TABLE animals (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  age TEXT NOT NULL,
  gender TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  adoption_status TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- applications 테이블
CREATE TABLE applications (
  id TEXT PRIMARY KEY,
  animal_id TEXT REFERENCES animals(id),
  applicant_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 환경변수

### .env.local
```bash
NEXT_PUBLIC_SUPABASE_URL=https://qlgttwhhxhvqjfylxupp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_PASSWORD=...
ADMIN_COOKIE_SECRET=...
```

## 패키지 의존성

### dependencies
```json
{
  "lucide-react": "^0.468.0",
  "next": "14.2.28",
  "react": "^18",
  "react-dom": "^18"
}
```

### devDependencies
```json
{
  "@types/node": "^20",
  "@types/react": "^18",
  "@types/react-dom": "^18",
  "autoprefixer": "^10.0.1",
  "postcss": "^8",
  "tailwindcss": "^3.3.0",
  "typescript": "^5"
}
```

## 빌드 및 배포

### 개발 환경
```bash
npm run dev        # 개발 서버 실행 (localhost:3000)
npm run build      # 프로덕션 빌드
npm run start      # 프로덕션 서버 실행
npm run lint       # ESLint 실행
```

### 배포 환경 (계획)
- **Vercel**: Next.js 최적화 호스팅
  - 자동 빌드 및 배포
  - Edge Network CDN
  - 환경변수 관리

## 기술적 제약사항

### 현재 제약
1. **서버 환경변수 의존**
   - `SUPABASE_SERVICE_ROLE_KEY` 누락 시 API 오류
   - 관리자 비밀번호/쿠키 시크릿 누락 시 로그인 불가

2. **클라이언트 사이드 전용 UI**
   - SEO 최적화 제한
   - 초기 로딩 속도 영향

3. **이미지 호스팅**
   - 외부 URL 의존 (Unsplash)
   - 이미지 업로드 기능 없음
   - 이미지 최적화 미적용

4. **인증/권한**
   - 관리자 로그인은 단일 비밀번호 기반
   - 세션 관리/권한 세분화는 미구현

### 브라우저 호환성
- **지원 브라우저**: 최신 Chrome, Firefox, Safari, Edge
- **필수 기능**: localStorage, ES6+, Fetch API
- **반응형**: 모바일, 태블릿, 데스크톱

## 성능 고려사항

### 최적화 적용
- React Hooks 메모이제이션 (useCallback)
- 조건부 렌더링으로 불필요한 DOM 최소화
- Tailwind CSS JIT 모드 (필요한 클래스만 생성)

### 미적용 (향후 개선)
- Next.js Image 컴포넌트 (이미지 최적화)
- 코드 스플리팅 (동적 import)
- 서버 사이드 렌더링 (SSR)
- 정적 사이트 생성 (SSG)
- API 라우트 캐싱

## 보안 고려사항

### 현재 상태
- ✅ 관리자 로그인(비밀번호) 및 쿠키 세션 적용
- ✅ 서버 사이드 검증(API Route Handler)
- ⚠️ CORS 정책 미설정
- ⚠️ Rate limiting 없음

### 향후 개선 필요
- 인증/권한 시스템 (Supabase Auth)
- HTTPS 강제
- XSS/CSRF 방어
- 입력 sanitization

## 개발 환경 설정

### 필수 요구사항
- Node.js 18+ 
- npm 또는 yarn
- 모던 브라우저 (Chrome, Firefox, Safari, Edge)

### 로컬 개발 시작
```bash
# 의존성 설치
npm install

# 환경변수 설정
cp .env.local.example .env.local
# .env.local 파일에 Supabase 키 입력

# 개발 서버 실행
npm run dev

# 브라우저에서 http://localhost:3000 접속
```

## 코드 품질

### TypeScript 설정
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Tailwind 설정
```javascript
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff7ed',
          // ... 생략
          500: '#f97316',
          600: '#ea580c',
        },
      },
    },
  },
}
```

## 알려진 이슈

### 해결됨
- ✅ JSX 파싱 오류 (landing/page.tsx 재작성으로 해결)
- ✅ 이미지 표시 오류 (fallback 및 데이터 병합으로 해결)
- ✅ 라우팅 혼선 (경로 재구성으로 해결)

### 미해결 (우선순위 낮음)
- localStorage 데이터 영구성 제한
- 관리자 페이지 접근 제한 없음
- 이미지 최적화 미적용
