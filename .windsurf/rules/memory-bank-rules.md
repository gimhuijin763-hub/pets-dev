---
trigger: manual
---
# Memory Bank Rules

## 목적
- 세션이 바뀌어도 프로젝트 문맥을 잃지 않도록 현재 프로젝트 기준의 Memory Bank를 유지한다.
- 모든 핵심 문서는 현재 작업 중인 프로젝트 루트 내부의 `.windsurf/`에만 저장한다.

## 가장 중요한 경로 규칙
- Memory Bank 문서는 반드시 **현재 작업 중인 프로젝트 루트 디렉토리 내부**의 `.windsurf/`에 생성한다.
- 절대로 공통 워크스페이스 루트, 상위 공용 폴더, 다른 프로젝트의 `.windsurf/`에 생성하지 않는다.
- 여러 프로젝트가 열린 상태라면, 반드시 **현재 수정 중인 코드베이스의 루트**를 기준으로 `.windsurf/` 경로를 결정한다.
- 문서를 만들기 전 현재 프로젝트 루트를 먼저 확인하고, 그 위치가 맞는지 검증한다.

## 프로젝트 루트 판별 기준
현재 프로젝트 루트는 다음 중 하나 이상을 포함하는 가장 가까운 디렉토리로 판단한다.
- `.git/`
- `package.json`
- `pyproject.toml`
- `requirements.txt`
- `manage.py`
- `Cargo.toml`
- `go.mod`
- `pom.xml`
- `next.config.*`
- `tsconfig.json`

위 기준을 바탕으로 현재 코드 변경이 이루어지는 저장소 루트를 찾고, 그 안의 `.windsurf/`만 사용한다.

## 폴더 구조
프로젝트 루트 기준:

- `.windsurf/projectbrief.md`
- `.windsurf/productContext.md`
- `.windsurf/activeContext.md`
- `.windsurf/systemPatterns.md`
- `.windsurf/techContext.md`
- `.windsurf/progress.md`
- `.windsurf/plans/`
- `.windsurf/context/`
- `.windsurf/task-logs/`

## Core Files 역할

### `projectbrief.md`
- 프로젝트 목적
- 범위
- 핵심 요구사항
- 주요 성공 기준

### `productContext.md`
- 왜 이 프로젝트를 만드는지
- 어떤 문제를 해결하는지
- 사용자 경험 목표
- 주요 사용 시나리오

### `activeContext.md`
- 현재 작업 중인 범위
- 최근 변경 사항
- 다음 작업 우선순위
- 현재 논의 중인 결정 사항

### `systemPatterns.md`
- 시스템 구조
- 설계 패턴
- 핵심 모듈 관계
- 반복적으로 사용하는 구현 방식

### `techContext.md`
- 기술 스택
- 런타임/빌드 환경
- 제약 사항
- 주요 패키지 및 버전
- 외부 연동 정보

### `progress.md`
- 완료된 작업
- 남은 작업
- 현재 상태
- 알려진 이슈
- 주의할 리스크

## 계획 문서 규칙
- 계획 문서는 `.windsurf/plans/` 아래에 생성한다.
- 계획 문서는 작업 단위별로 분리할 수 있다.
- 각 계획 문서는 아래 형식을 기본으로 한다.

GOAL:
- 이번 작업의 목표

ARCHITECTURE:
- 구조적 변경 사항
- 주요 설계 결정
- 컴포넌트/모듈 관계

IMPLEMENTATION:
- 실제 구현 방식
- 파일 단위 변경 포인트
- 데이터 흐름 및 예외 처리

PACKAGES:
- 사용 패키지
- 버전
- 추가/삭제 이유

## Task Log 규칙
- 주요 작업이 끝나면 `.windsurf/task-logs/`에 로그를 남긴다.
- 파일명 예시:
  - `task-log_2026-03-13_09-30.md`

- 형식:
  - GOAL
  - IMPLEMENTATION
  - COMPLETED

예시:

GOAL:
- 로그인 예외 처리 개선 및 세션 유지 로직 보완

IMPLEMENTATION:
- auth provider의 null 체크 추가
- refresh token 만료 시 로그아웃 분기 처리
- 관련 문서와 progress 갱신

COMPLETED:
- 2026-03-13 09:30

## 업데이트 시점
다음 경우 Memory Bank를 갱신한다.
1. 중요한 기능 구현 완료 후
2. 구조/패턴 변경 후
3. 새로운 기술 제약을 확인한 경우
4. 사용자가 `update memory bank`를 요청한 경우
5. 기존 문서와 현재 코드 상태가 달라진 경우

## update memory bank 요청 시 규칙
- `update memory bank` 요청을 받으면 core file 전체를 검토한다.
- 특히 아래 파일을 우선 최신화한다.
  - `activeContext.md`
  - `progress.md`
  - 필요 시 `systemPatterns.md`
  - 필요 시 `techContext.md`

## 추가 Context 문서
- 복잡한 기능, 외부 연동, API 명세, 배포 절차, 테스트 전략은 `.windsurf/context/`에 별도 문서로 분리한다.
- 예시:
  - `.windsurf/context/auth-flow.md`
  - `.windsurf/context/supabase-schema.md`
  - `.windsurf/context/deploy-vercel.md`

## 절대 규칙
- Memory Bank는 현재 프로젝트 단위로만 유지한다.
- 다른 프로젝트의 `.windsurf/`를 재사용하지 않는다.
- 공용 워크스페이스 `.windsurf/`에 작성하지 않는다.
- 문서 생성 전 현재 루트를 확인하고, 경로가 프로젝트 내부인지 검증한다.
