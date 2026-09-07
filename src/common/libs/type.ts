/**
 * Auth
 */

import { Gender, State } from '../../../generated/prisma/enums';

// 기본 세션 정보
export type TReqUser = {
  id: string;
  email: string;
  loginId: string | null;
  name: string | null;
  nickname: string;
  gender: Gender | null;
  birthDay: Date | null;
  phoneNumber: string | null;
  isPublic: State;
  verify: State;
};

// 기존 구글 계정이 존재하지 않을 때의 세션 정보
export type TSignUpGoogleReqUser = {
  email: string;
  nickname: string;
  accessToken: string;
  email_verified: boolean;
};

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
