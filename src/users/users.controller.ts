import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UsersService } from './users.service';
import {
  RequestUseCommentDto,
  RequestUsePostDto,
  RequestUserDto,
  TRequestUseCommentDto,
  TRequestUsePostDto,
  TUpdateProfileDto,
  TUpdateUserDto,
  UpdateProfileDto,
  UpdateUserDto,
} from './dto';
import {
  Authority,
  Gender,
  Provider,
  State,
  Type,
} from '../../generated/prisma/enums';
import { PaginationDto } from '../common/dto/paginationDto';

export class UsersController {
  private usersService: UsersService;
  constructor(usersService: UsersService) {
    this.usersService = usersService;
  }

  // 유저 마이페이지 조회
  userInfo = async (
    req: Request,
    res: Response,
  ): Promise<
    Response<{
      message: string;
      data: {
        id: string;
        email: string;
        nickname: string;
        image: string | null;
        verify: State;
        isPublic: State;
        createdAt: string;
        roles: { authority: Authority } | null;
        provider: Provider[];
        posts: Array<{
          id: string;
          title: string;
          category: {
            key: string;
            name: string;
          };
          createdAt: string;
          count: {
            comments: number;
            likes: number;
          };
        }>;
        comments: Array<{
          id: string;
          context: string;
          createdAt: string;
          posts: {
            id: string;
            title: string;
          };
        }>;
        count: {
          posts: number;
          comments: number;
        };
      };
    }>
  > => {
    return res.status(StatusCodes.OK).json({
      message: '유저 정보 조회 완료.',
      data: await this.usersService.userInfo(
        await RequestUserDto(req.user.id as string),
      ),
    });
  };

  // 해당 받은 좋아요 수 조회(게시글 좋아요)
  receiveLikes = async (
    req: Request,
    res: Response,
  ): Promise<Response<{ message: string; count: number }>> => {
    return res.status(StatusCodes.OK).json({
      message: '받은 좋아요 수 조회 완료.',
      count: await this.usersService.receiveLikes(
        await RequestUserDto(req.user.id as string),
      ),
    });
  };

  // 작성 댓글 목록 조회
  writeUserPosts = async (
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
        isPublic: State;
        createdAt: string;
        count: {
          comments: number;
          likes: number;
          views: number;
        };
      }[];
      countState: {
        public: number;
        private: number;
      };
      paginations: {
        page: number;
        pages: number;
        count: number;
      };
    }>
  > => {
    return res.status(StatusCodes.OK).json({
      message: '작성한 게시글 목록 조회 완료.',
      data: await this.usersService.writeUserPosts(
        await RequestUserDto(req.user.id as string),
        await PaginationDto({
          page: req.query.page as string,
          pages: req.query.pages as string,
        }),
        await RequestUsePostDto(req.query as TRequestUsePostDto),
      ),
    });
  };

  // 유저가 작성한 댓글 목록 조회
  writeUserComments = async (
    req: Request,
    res: Response,
  ): Promise<
    Response<{
      message: string;
      data: {
        comments: {
          id: string;
          context: string;
          type: Type;
          parentId: string | null;
          createdAt: string;
          posts: {
            id: string;
            title: string;
            category: {
              key: string;
              name: string;
            };
          };
          users: {
            nickname: string;
          };
        }[];
        countState: {
          week: number;
          reply: number;
        };
        paginations: {
          page: number;
          pages: number;
          count: number;
        };
      };
    }>
  > => {
    return res.status(StatusCodes.OK).json({
      message: '작성한 댓글 목록 조회 완료.',
      data: await this.usersService.writeUserComments(
        (await RequestUserDto(req.user.id as string)).id,
        await PaginationDto({
          page: req.query.page as string,
          pages: req.query.pages as string,
        }),
        await RequestUseCommentDto(req.query as TRequestUseCommentDto),
      ),
    });
  };

  // 유저 기존 프로필 정보 조회
  getExistingProfileInfo = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<
    Response<{
      message: string;
      data: {
        id: string;
        email: string;
        loginId: string | null;
        nickname: string;
        image: string | null;
        isPublic: State;
      };
    }>
  > => {
    return res.status(StatusCodes.OK).json({
      message: '유저 기존 프로필 정보 조회 완료.',
      data: await this.usersService.getExistingProfileInfo(
        (await RequestUserDto(req.user.id as string)).id,
      ),
    });
  };

  // 유저 기존 정보 조회
  getExistingInfo = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<
    Response<{
      message: string;
      data: {
        id: string;
        email: string;
        loginId: string | null;
        name: string | null;
        nickname: string;
        image: string | null;
        gender: Gender | null;
        birthDay: Date | null;
        phoneNumber: string | null;
        address: string | null;
        isPublic: State;
      };
    }>
  > => {
    return res.status(StatusCodes.OK).json({
      message: '유저 기존 정보 조회 완료.',
      data: await this.usersService.getExistingInfo(
        (await RequestUserDto(req.user.id as string)).id,
      ),
    });
  };

  // 유저 프로필 업데이트
  prifileUpdate = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<{ message: string }>> => {
    await this.usersService.prifileUpdate(
      (await RequestUserDto(req.user.id as string)).id,
      await UpdateProfileDto(req.body as TUpdateProfileDto),
    );
    return res.status(StatusCodes.OK).json({
      message: '유저 정보 업데이트 완료.',
    });
  };

  // 유저 정보 업데이트
  update = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<{ message: string }>> => {
    await this.usersService.update(
      (await RequestUserDto(req.user.id as string)).id,
      await UpdateUserDto(req.body as TUpdateUserDto),
    );
    return res.status(StatusCodes.OK).json({
      message: '유저 정보 업데이트 완료.',
    });
  };

  // 유저 회원 탈퇴
  remove = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<{ message: string }>> => {
    await this.usersService.remove(
      (await RequestUserDto(req.user.id as string)).id,
    );
    return res.status(StatusCodes.OK).json({
      message: '회원 탈퇴 완료.',
    });
  };
}
