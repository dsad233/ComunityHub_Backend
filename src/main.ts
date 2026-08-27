import express, { Express } from 'express';
import GlobalsRotuer from './globals/globals.router';
import AuthRouter from './auth/auth.router';
import UsersRouter from './users/users.router';
import PostsRouter from './posts/posts.router';
import CommentsRouter from './comments/comments.router';
import LikesRouter from './likes/likes.router';
import CategoryRouter from './categories/categories.router';

import ErrorMiddleware from './common/middlewares/errorMiddleware';
import { MorganConfig } from './common/middlewares/morganConfig';
import { CorsConfig } from './common/middlewares/corsConfig';

import { prisma } from './common/configs/prisma-client';
import cookieParser from 'cookie-parser';
import { MongoDBConfig } from './common/configs/mongodb.config';
import passport from 'passport';
import { GoogleStrategy } from './common/middlewares/googleStrategy';
import { NODE_ENV, RUNNING_PORT } from './common/configs/keys';
import helmet from 'helmet';

const app: Express = express();
const port: number = RUNNING_PORT;

// req.body 수용 용량을 기존 100kb에서 50mb 수용으로 변경
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(CorsConfig());
if (NODE_ENV === 'prod') {
  app.use(helmet());
}

// MongoDB 설정
MongoDBConfig();
// passport 설정
passport.use(GoogleStrategy());
// morgan logger 설정
app.use(MorganConfig());

app.use('/auth', AuthRouter);
app.use('/users', UsersRouter);
app.use('/posts', [PostsRouter, CommentsRouter, LikesRouter]);
app.use('/globals', GlobalsRotuer);
app.use('/categories', CategoryRouter);

// 에러 핸들링 미들웨어
app.use(ErrorMiddleware);

app.listen(port, () => {
  prisma.$connect();
  console.log(port, '실행중...');
});

// 종료 이벤트
process.on('exit', () => {
  console.log('애플리케이션 종료중...');

  setTimeout(() => {
    prisma.$disconnect();

    process.exit(1);
  }, 2000);
});
