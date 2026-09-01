import express from 'express';

import AuthRouter from './auth/auth.router';
import UsersRouter from './users/users.router';
import PostsRouter from './posts/posts.router';
import CommentsRouter from './comments/comments.router';
import LikesRouter from './likes/likes.router';
import GlobalsRotuer from './globals/globals.router';
import CategoryRouter from './categories/categories.router';

const router: express.Router = express.Router();

// v1 api router
router.use('/auth', AuthRouter);
router.use('/users', UsersRouter);
router.use('/posts', [PostsRouter, CommentsRouter, LikesRouter]);
router.use('/globals', GlobalsRotuer);
router.use('/categories', CategoryRouter);

export default router;
