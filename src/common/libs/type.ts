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
 * Posts
 */
export enum CategoryType {
  ALL = '전체',
  FREE = '자유',
  SPORTS = '스포츠',
  GAME = '게임',
}
