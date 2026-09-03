import express from 'express';
import { prisma } from '../common/configs/prisma-client';
import { redis } from '../redis/redis.config';
import passport from 'passport';

import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import AsyncWrapper from '../common/middlewares/asyncWrapper';
import { RedisService } from '../redis/redis.service';
import { JwtService } from '../jwt/jwt.service';
import AuthMiddleware from '../common/middlewares/auth.middleware';
import { MailerService } from '../mailer/mailer.service';

const router: express.Router = express.Router();

const authRepository = new AuthRepository(prisma);
const authService = new AuthService(
  authRepository,
  new RedisService(redis),
  new JwtService(),
  new MailerService(),
);
const authController = new AuthController(authService);

// 로그인 아이디 유무 확인
router.get('/check/loginid', AsyncWrapper(authController.checkLoginId));
// 이메일 유무 확인
router.get('/check/email', AsyncWrapper(authController.checkEmail));
// 닉네임 유무 확인
router.get('/check/nickname', AsyncWrapper(authController.checkNickname));
// 회원가입
router.post('/signup', AsyncWrapper(authController.signUp));
// 유저 이메일 인증 여부 업데이트
router.get('/verify', AsyncWrapper(authController.verifyEmail));
// 로그인
router.post('/signin', AsyncWrapper(authController.signIn));
// 로그아웃
router.post('/signout', AuthMiddleware, AsyncWrapper(authController.signOut));
// 토큰 재발급
router.post('/reissue', AuthMiddleware, AsyncWrapper(authController.reissue));
// 패스워드 변경
router.patch('/update/password', AsyncWrapper(authController.updatePassword));
// 이메일 인증
router.post('/certification', AsyncWrapper(authController.certifiEmail));
// 이메일 인증 완료
router.post(
  '/authentication',
  AsyncWrapper(authController.authenticationEmail),
);

/**
 * OAuth 2.0 Google 로그인
 */

// Google 로그인 요청
router.get('/signin/social/google', passport.authenticate('google'));

// Google 로그인 콜백 (로그인 완료 후, 토큰 발급)
router.get(
  '/oauth2/callback/google',
  passport.authenticate('google', {
    session: false,
    prompt: 'consent',
  }),
  AsyncWrapper(authController.googleCallback),
);

// 구글 계정 연동 URL 요청
router.get(
  '/link/social/google',
  AuthMiddleware,
  AsyncWrapper(authController.googleSocialLink),
);
// 구글 계정 연동 콜백
router.get(
  '/link/oauth2/callback/google',
  AsyncWrapper(authController.googleSocialLinkCallback),
);
// 구글 계정 등록 처리
router.post(
  '/register/oauth2/google',
  AuthMiddleware,
  AsyncWrapper(authController.googleSocialLinkRegister),
);

export default router;
