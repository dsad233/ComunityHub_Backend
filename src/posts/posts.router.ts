import express, { Request, Response, NextFunction } from 'express';
import { prisma } from '../common/configs/prisma-client';
import { redis } from '../redis/redis.config';

import { PostsRepository } from './posts.repository';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';

import AsyncWrapper from '../common/middlewares/asyncWrapper';
import { RedisService } from '../redis/redis.service';
import AuthMiddleware from '../common/middlewares/auth.middleware';
import GuestMiddleware from '../common/middlewares/guest.middleware';

const router: express.Router = express.Router();

const postsRepository = new PostsRepository(prisma);
const postsService = new PostsService(postsRepository, new RedisService(redis));
const postsController = new PostsController(postsService);

// 게시글 생성
router.post('', AuthMiddleware, AsyncWrapper(postsController.create));
// 카테고리 목록 조회
router.get('/categories', AsyncWrapper(postsController.findCategory));
// 카테고리별 게시글 수 조회
router.get(
  '/count/category',
  AsyncWrapper(postsController.countByCategoryPost),
);
// 게시글 목록 조회
router.get('', GuestMiddleware, AsyncWrapper(postsController.find));
// 게시글 상세 조회
router.get('/:id', GuestMiddleware, AsyncWrapper(postsController.findOne));
// 게시글 기존 정보 조회
router.get(
  '/:id/existing/info',
  AuthMiddleware,
  AsyncWrapper(postsController.getExistingPostInfo),
);
// 게시글 수정
router.patch(
  '/:id/update',
  AuthMiddleware,
  AsyncWrapper(postsController.update),
);
// 게시글 삭제 (소프트 삭제)
router.patch(
  '/:id/remove',
  AuthMiddleware,
  AsyncWrapper(postsController.remove),
);

export default router;
