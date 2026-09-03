import express from 'express';
import { prisma } from '../common/configs/prisma-client';
import { redis } from '../redis/redis.config';

import AuthMiddleware from '../common/middlewares/auth.middleware';
import { RedisService } from '../redis/redis.service';
import AsyncWrapper from '../common/middlewares/asyncWrapper';

import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

const router: express.Router = express.Router();

const usersRepository = new UsersRepository(prisma);
const usersService = new UsersService(usersRepository, new RedisService(redis));
const usersController = new UsersController(usersService);
// 유저 마이페이지 조회
router.get('/info', AuthMiddleware, AsyncWrapper(usersController.userInfo));
// 해당 받은 좋아요 수 조회(게시글 좋아요)
router.get(
  '/received/likes',
  AuthMiddleware,
  AsyncWrapper(usersController.receiveLikes),
);
// 작성 댓글 목록 조회
router.get(
  '/write/posts',
  AuthMiddleware,
  AsyncWrapper(usersController.writeUserPosts),
);
// 유저가 작성한 댓글 목록 조회
router.get(
  '/write/comments',
  AuthMiddleware,
  AsyncWrapper(usersController.writeUserComments),
);
// 유저 기존 프로필 정보 조회
router.get(
  '/existing/profile/info',
  AuthMiddleware,
  AsyncWrapper(usersController.getExistingProfileInfo),
);
// 유저 기존 정보 조회
router.get(
  '/existing/info',
  AuthMiddleware,
  AsyncWrapper(usersController.getExistingInfo),
);
// 유저 프로필 업데이트
router.patch(
  '/profile/update',
  AuthMiddleware,
  AsyncWrapper(usersController.prifileUpdate),
);
// 유저 정보 업데이트
router.patch('/update', AuthMiddleware, AsyncWrapper(usersController.update));
// 유저 회원 탈퇴
router.patch('/remove', AuthMiddleware, AsyncWrapper(usersController.remove));

export default router;
