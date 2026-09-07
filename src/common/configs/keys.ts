import dotenv from 'dotenv';
import { checkEnvironment } from '../utils';

// 프로젝트 구동 환경 분리
if (process.env.NODE_ENV === 'prod') {
  dotenv.config({ path: process.cwd() + '/' + '.env.prod' });
} else if (process.env.NODE_ENV === 'dev') {
  dotenv.config({ path: process.cwd() + '/' + '.env.dev' });
} else {
  dotenv.config({ path: process.cwd() + '/' + '.env' });
}

export const NODE_ENV = checkEnvironment('NODE_ENV') as string;
export const SERVER_URL = checkEnvironment('SERVER_URL') as string;
export const RUNNING_PORT = checkEnvironment('RUNNING_PORT') as number;
export const TIMEZONE = checkEnvironment('TIMEZONE') as string;
export const DB_HOST = checkEnvironment('DB_HOST') as string;
export const DB_USER = checkEnvironment('DB_USER') as string;
export const DB_PASS = checkEnvironment('DB_PASS') as string;
export const DB_PORT = checkEnvironment('DB_PORT') as number;
export const DB_NAME = checkEnvironment('DB_NAME') as string;
export const DB_POOL_TIMEOUT = checkEnvironment('DB_POOL_TIMEOUT') as number;
export const DB_CONNECT_TIMEOUT = checkEnvironment(
  'DB_CONNECT_TIMEOUT',
) as number;
export const DB_IDLE_TIMEOUT = checkEnvironment('DB_IDLE_TIMEOUT') as number;
export const DB_CONNECTON_LIMIT = checkEnvironment(
  'DB_CONNECTON_LIMIT',
) as number;
export const DB_PUBLIC_KEY_RETRIEVAL = checkEnvironment(
  'DB_PUBLIC_KEY_RETRIEVAL',
) as boolean;
export const DB_USESSL = checkEnvironment('DB_USESSL') as boolean;

/**
 * MongoDB
 */
export const MONGO_DB_URL = checkEnvironment('MONGO_DB_URL') as string;

/**
 * Bcrypt
 */
export const BCYPT_PASSWORD_SALT = checkEnvironment(
  'BCYPT_PASSWORD_SALT',
) as number;

/**
 * Jwt
 */
export const JWT_ACCESS_ALGORITHM = checkEnvironment(
  'JWT_ACCESS_ALGORITHM',
) as string;
export const JWT_ACCESS_SECRET_KEY = checkEnvironment(
  'JWT_ACCESS_SECRET_KEY',
) as string;
export const JWT_ACCESS_EXPIRES = checkEnvironment(
  'JWT_ACCESS_EXPIRES',
) as string;
export const JWT_ACCESS_TTL = checkEnvironment('JWT_ACCESS_TTL') as number;

export const JWT_REFRESH_ALGORITHM = checkEnvironment(
  'JWT_REFRESH_ALGORITHM',
) as string;
export const JWT_REFRESH_SECRET_KEY = checkEnvironment(
  'JWT_REFRESH_SECRET_KEY',
) as string;
export const JWT_REFRESH_EXPIRES = checkEnvironment(
  'JWT_REFRESH_EXPIRES',
) as string;
export const JWT_REFRESH_TTL = checkEnvironment('JWT_REFRESH_TTL') as number;

// Guest
export const JWT_GUEST_ACCESS_ALGORITHM = checkEnvironment(
  'JWT_GUEST_ACCESS_ALGORITHM',
) as string;
export const JWT_GUEST_ACCESS_SECRET_KEY = checkEnvironment(
  'JWT_GUEST_ACCESS_SECRET_KEY',
) as string;
export const JWT_GUEST_ACCESS_EXPIRES = checkEnvironment(
  'JWT_GUEST_ACCESS_EXPIRES',
) as string;
export const JWT_GUEST_ACCESS_TTL = checkEnvironment(
  'JWT_GUEST_ACCESS_TTL',
) as number;

/**
 * Redis
 */
export const REDIS_HOST = checkEnvironment('REDIS_HOST') as string;
export const REDIS_PORT = checkEnvironment('REDIS_PORT') as number;
export const REDIS_PASS = checkEnvironment('REDIS_PASS') as string;
export const REDIS_DB = checkEnvironment('REDIS_DB') as number;

/**
 * NodeMailer
 */
export const MAIL_USER = checkEnvironment('MAIL_USER') as string;
export const MAIL_PASS = checkEnvironment('MAIL_PASS') as string;
export const MAILER_HOST = checkEnvironment('MAILER_HOST') as string;
export const MAILER_PORT = checkEnvironment('MAILER_PORT') as number;

/**
 * OAuth Google
 */
export const GOOGLE_CLIENT_ID = checkEnvironment('GOOGLE_CLIENT_ID') as string;
export const GOOGLE_CLIENT_SECRET_KEY = checkEnvironment(
  'GOOGLE_CLIENT_SECRET_KEY',
) as string;
export const GOOGLE_CALLBACK_URL = checkEnvironment(
  'GOOGLE_CALLBACK_URL',
) as string;
export const GOOGLE_LOGIN_SUCCESS_REDIRECT_URL = checkEnvironment(
  'GOOGLE_LOGIN_SUCCESS_REDIRECT_URL',
) as string;
export const GOOGLE_SIGNUP_SUCCESS_REDIRECT_URL = checkEnvironment(
  'GOOGLE_SIGNUP_SUCCESS_REDIRECT_URL',
) as string;
export const GOOGLE_SIGNUP_FAIL_REDIRECT_URL = checkEnvironment(
  'GOOGLE_SIGNUP_FAIL_REDIRECT_URL',
) as string;

// 구글 계정 연동 콜백링크
export const GOOGLE_LINK_CALLBACK_URL = checkEnvironment(
  'GOOGLE_LINK_CALLBACK_URL',
) as string;
export const GOOGLE_LINK_SUCCESS_REDIRECT_URL = checkEnvironment(
  'GOOGLE_LINK_SUCCESS_REDIRECT_URL',
) as string;

/**
 * 인기도 계산 가중치
 */
export const POST_LIKE_WEIGHT = checkEnvironment('POST_LIKE_WEIGHT') as number;
export const POST_COMMENT_WEIGHT = checkEnvironment(
  'POST_COMMENT_WEIGHT',
) as number;
export const POST_VIEW_WEIGHT = checkEnvironment('POST_VIEW_WEIGHT') as number;
