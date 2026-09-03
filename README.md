# ComunityHub - 커뮤니티 웹 프로젝트

Node.js와 TypeScript를 기반으로 한 현대적인 커뮤니티 웹 서비스입니다. Express, Prisma, Redis를 활용하여 구축되었습니다.

> 🌐 **웹 페이지**: https://communityhub.kro.kr  
> 📱 **프론트엔드 코드**: https://github.com/dsad233/mini_type_web

## 🎯 프로젝트 개요

- **프로젝트명**: ComunityHub
- **버전**: 1.0.0
- **라이선스**: MIT
- **기술 스택**: Node.js, TypeScript, Express, Prisma, Redis, MySQL

## ✨ 주요 기능

### 게시글 관리

- 게시글 작성, 조회, 수정, 삭제 (소프트 삭제)
- 카테고리별 게시글 분류 (자유, 스포츠, 게임)
- 이미지 업로드 및 관리
- 조회수, 좋아요, 댓글 수 조회
- 게시글 공개/비공개 설정

### 커뮤니티 기능

- 게시글 댓글 및 대댓글 시스템
- 사용자 프로필 관리
- 탈퇴 유저 정보 자동 처리
- 인기 작성자 순위 시스템 (TOP 3)
- 인기도 가중치 계산 (조회수, 좋아요, 댓글)

### 카테고리 관리

- 카테고리 목록 조회
- 카테고리별 게시글 수 조회
- 인기 카테고리 조회

### 커뮤니티 통계

- 총 댓글 수 조회
- 당일 게시글/댓글/좋아요/가입 수 집계

### 최적화

- Redis 캐싱 지원 (30분 단위)
- 인기 게시글 순위 관리
- 중복 조회수 방지 (IP 기반)
- 페이지네이션 지원

### 인증 및 보안

- JWT 토큰 기반 인증
- Google OAuth 2.0 로그인
- bcrypt 비밀번호 암호화
- Helmet을 통한 보안 헤더 설정
- 권한 관리 (User, Admin, Moderator)

## 📦 설치 및 실행

### 필수 요구사항

- Node.js 22+
- MySQL
- Redis

## 📁 프로젝트 구조

```
src/
├── posts/              # 게시글 모듈
│   ├── posts.service.ts
│   ├── posts.repository.ts
│   └── dto/
├── categories/         # 카테고리 모듈
│   ├── categories.service.ts
│   ├── categories.repository.ts
│   └── dto/
├── globals/            # 커뮤니티 통계 모듈
│   ├── globals.service.ts
│   ├── globals.repository.ts
│   └── dto/
├── common/             # 공통 유틸리티
│   ├── configs/        # 설정값 (가중치 등)
│   ├── utils.ts
│   ├── dto/
│   └── libs/
├── redis/              # Redis 서비스
├── auth/               # 인증 모듈
└── main.ts             # 애플리케이션 진입점
```

## 🔧 주요 기술 스택

| 분야         | 기술                        |
| ------------ | --------------------------- |
| 런타임       | Node.js, TypeScript         |
| 프레임워크   | Express 5.2.1               |
| 데이터베이스 | Prisma 7.2.0, MySQL         |
| 캐싱         | Redis (ioredis)             |
| 인증         | JWT, Passport, Google OAuth |
| 보안         | bcrypt, Helmet              |
| 로깅         | Winston, Morgan             |
| 이메일       | Nodemailer                  |
| 개발 도구    | ESLint, Prettier, tsx       |

## 📝 API 주요 엔드포인트

### 게시글

- `GET /posts` - 게시글 목록 조회 (페이지네이션, 정렬)
- `GET /posts/:id` - 게시글 상세 조회
- `POST /posts` - 게시글 작성
- `PATCH /posts/:id` - 게시글 수정
- `DELETE /posts/:id` - 게시글 삭제

### 카테고리

- `GET /categories` - 카테고리 목록 조회
- `GET /categories/count` - 카테고리별 게시글 수
- `GET /categories/popular` - 인기 카테고리 조회

### 커뮤니티 통계

- `GET /globals/users/count` - 총 사용자 수
- `GET /globals/comments/count` - 총 댓글 수
- `GET /globals/posts/today` - 당일 게시글 수
- `GET /globals/today/counts` - 당일 통계 (게시글, 댓글, 좋아요, 가입)
- `GET /globals/users/popular` - 인기 작성자 TOP 10

## 🎯 핵심 서비스 설명

### PostsService

게시글 CRUD 및 관리

- 게시글 생성 시 Redis에 인기 작성자 카운트 증가
- 카테고리별 게시글 통계
- 게시글 조회 시 캐싱 지원
- 상세 조회 시 댓글, 대댓글 포함

### CategoriesService

카테고리 관리 및 인기도 분석

- 인기 카테고리 자동 계산
- 가중치 기반 인기도 산출:
  - 좋아요: POST_LIKE_WEIGHT
  - 댓글: POST_COMMENT_WEIGHT
  - 조회수: POST_VIEW_WEIGHT

### GlobalsService

커뮤니티 전체 통계 제공

- 일일 새 가입자, 게시글, 댓글, 좋아요 집계
- 인기 작성자 순위 (Redis Sorted Set 활용)

## 💡 인기도 가중치 시스템

```
인기도 = (좋아요 수 × POST_LIKE_WEIGHT)
       + (댓글 수 × POST_COMMENT_WEIGHT)
       + (조회수 × POST_VIEW_WEIGHT)
```

설정값은 `src/common/configs/keys.ts`에서 관리합니다.

## 🚀 Redis 활용

### Sorted Set 구조

- `CACHED:POPULAR:USERS` - 인기 작성자 순위 캐시

### 조회 데이터 캐시 메모리 적재

- `CACHED:POSTS:1:category=FREE:orderBy=NEW:` - 게시글 목록 데이터 캐시
- `CACHED:TODAY:NEW:COUNT` - 당일 통계 캐시 (게시글, 댓글, 좋아요, 가입)

### 캐시 정책

- TTL: 30분 (1800초)
- 자동 갱신: 데이터 변경 시 즉시 무효화

## 📝 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

---

**마지막 업데이트**: 2026년 9월 1일
