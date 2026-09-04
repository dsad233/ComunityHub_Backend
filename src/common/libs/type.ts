/**
 * Auth
 */

// 토큰 타입
export enum TokenType {
  ACCESS = 'ACCESS',
  REFRESH = 'REFRESH',
}

// prefix type
export enum PrefixType {
  CACHED = 'CACHED',
  USERS = 'USERS',
  POSTS = 'POSTS',
  COUNT = 'COUNT',
  COMMENTS = 'COMMENTS',
  CATEGORY = 'CATEGORY',
  TODAY = 'TODAY',
  NEW = 'NEW',
  POPULAR = 'POPULAR',
  DUPE = 'DUPE',
  CONNECT = 'CONNECT',
  SOCIAL = 'SOCIAL',
}

/**
 * 권한 타입
 */
export enum AuthorityType {
  USER = '유저',
  ADMIN = '관리자',
}

/**
 * Posts
 */
export enum CategoryType {
  ALL = '전체',
  FREE = '자유',
  SPORTS = '스포츠',
  GAME = '게임',
}
