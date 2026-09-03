import { NextFunction, Request, Response } from 'express';
import { PostsService } from './posts.service';
import { StatusCodes } from 'http-status-codes';
import { CreatePostDto } from './dto/createPostDto';
import { TPaginationDto, PaginationDto } from '../common/dto/paginationDto';
import { RequestPostDto } from './dto/requestPostDto';
import { Category, State, Type } from '../../generated/prisma/enums';
import { TUpdatePostDto, UpdatePostDto } from './dto/updatePostDto';

export class PostsController {
  private readonly postsService: PostsService;
  constructor(postsService: PostsService) {
    this.postsService = postsService;
  }

  // 게시글 생성
  create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<{ message: string }>> => {
    await this.postsService.create(req.user.id, await CreatePostDto(req.body));

    return res
      .status(StatusCodes.CREATED)
      .json({ message: '게시글 생성 완료.' });
  };

  // 카테고리 목록 조회
  findCategory = async (
    req: Request,
    res: Response,
  ): Promise<
    Response<{
      message: string;
      data: Array<Object>;
    }>
  > => {
    return res.status(StatusCodes.OK).json({
      message: '카테고리 조회 완료.',
      data: await this.postsService.findCategory(),
    });
  };

  // 카테고리별 게시글 수 조회
  countByCategoryPost = async (
    req: Request,
    res: Response,
  ): Promise<
    Response<{
      message: string;
      data: {
        key: string;
        name: string;
        count: number;
      }[];
    }>
  > => {
    return res.status(StatusCodes.OK).json({
      message: '카테고리별 게시글 수 조회 완료.',
      data: await this.postsService.countByCategoryPost(),
    });
  };

  // 게시글 전체 조회
  find = async (
    req: Request,
    res: Response,
  ): Promise<
    Response<{
      message: string;
      data: {
        posts: {
          id: string;
          title: string;
          context: string | null;
          category: {
            key: string;
            name: string;
          };
          createdAt: string;
          users: { nickname: string; image: string | null };
          count: {
            comments: number;
            likes: number;
            views: number;
          };
        }[];
        paginations: {
          page: number;
          pages: number;
          count: number;
        };
      };
    }>
  > => {
    return res.status(StatusCodes.OK).json({
      message: '게시물 조회 완료.',
      data: await this.postsService.find(
        await PaginationDto({
          page: req.query.page as string,
          pages: req.query.pages as string,
        }),
        await RequestPostDto({
          search: req.query.search as string,
          category: req.query.category as string,
          isPublic: req.query.isPublic as string,
          orderBy: req.query.orderBy as string,
        }),
      ),
    });
  };

  // 게시글 상세 조회
  findOne = async (
    req: Request,
    res: Response,
  ): Promise<
    Response<{
      message: string;
      data: {
        id: string;
        title: string;
        context: string | null;
        category: {
          key: string;
          name: string;
        };
        images: string[] | null;
        isPublic: State;
        createdAt: string;
        users: { nickname: string; image: string | null; property: boolean };
        count: {
          likes: number;
          commentCount: number;
        };
        comments: {
          id: string | undefined;
          context: string | undefined;
          type: Type | undefined;
          parentId: string | undefined | null;
          createdAt: string | undefined;
          deletedAt: string | undefined;
          author:
            | { nickname: string; image: string | null; property: boolean }
            | undefined;
          replies:
            | {
                id: string | null;
                context: string | null;
                type: Type | null;
                parentId: string | null;
                createdAt: string | null;
                deletedAt: string;
                author: { nickname: string; image: string | null };
              }[]
            | undefined;
        }[];
      };
    }>
  > => {
    return res.status(StatusCodes.OK).json({
      message: '게시글 상세 조회 완료.',
      data: await this.postsService.findOne(
        req.params.id as string,
        req.user?.id,
        req.ip ?? (req.ips[0] as string),
      ),
    });
  };

  // 게시글 기존 정보 조회
  getExistingPostInfo = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<
    Response<{
      message: string;
      data: {
        title: string;
        category: Category;
        context: string | null;
        images: string[] | null;
        isPublic: State;
      };
    }>
  > => {
    return res.status(StatusCodes.OK).json({
      message: '기존 게시글 정보 조회 완료.',
      data: await this.postsService.getExistingPostInfo(
        req.params.id as string,
        req.user.id as string,
      ),
    });
  };

  // 게시글 수정
  update = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<
    Response<{
      message: string;
    }>
  > => {
    await this.postsService.update(
      req.params.id as string,
      req.user.id as string,
      await UpdatePostDto(req.body as TUpdatePostDto),
    );

    return res.status(StatusCodes.OK).json({
      message: '게시글 업데이트 완료.',
    });
  };

  // 게시글 삭제 (소프트 삭제)
  remove = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<
    Response<{
      message: string;
    }>
  > => {
    await this.postsService.remove(
      req.params.id as string,
      req.user.id as string,
    );

    return res.status(StatusCodes.OK).json({
      message: '게시글 삭제 완료.',
    });
  };
}
