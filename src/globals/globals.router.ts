import express from 'express';
import { prisma } from '../common/configs/prisma-client';
import { redis } from '../redis/redis.config';

import { GlobalsRepository } from './globals.repostiroy';
import { GlobalsService } from './globals.service';
import { GlobalsController } from './globals.controller';

import AsyncWrapper from '../common/middlewares/asyncWrapper';
import { RedisService } from '../redis/redis.service';

const router: express.Router = express.Router();

const globalsRepository = new GlobalsRepository(prisma);
const globalsService = new GlobalsService(
  globalsRepository,
  new RedisService(redis),
);
const globalsController = new GlobalsController(globalsService);

// 유저 총 인원 조회
router.get('/users/count', AsyncWrapper(globalsController.countUsers));
// 댓글 총 갯수 조회
router.get('/comments/count', AsyncWrapper(globalsController.countComments));
// 당일 작성 게시글 갯수 조회
router.get('/todays/post/count', AsyncWrapper(globalsController.todayPosts));
// 오늘 새 댓글 수, 회원 가입 수, 좋아요 누른 수, 오늘 게시글 작성 수 조회
router.get('/todays/count', AsyncWrapper(globalsController.todayCounts));
// 인기 작성자 목록 조회 TOP3
router.get('/populars/post', AsyncWrapper(globalsController.popularPostUsers));

export default router;
