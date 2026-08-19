import { Authority, PrismaClient } from '../../generated/prisma/client';
import { dateFormat } from '../common/utils';

export class GlobalsRepository {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // 유저 총 인원 조회
  countUsers = async (): Promise<number> => {
    return await this.prisma.user.count({
      where: {
        isPublic: 'TRUE',
        deletedAt: 'FALSE',
      },
    });
  };

  // 댓글 총 갯수 조회
  countComments = async (): Promise<number> => {
    return await this.prisma.comment.count({
      where: {
        deletedAt: 'FALSE',
        users: {
          deletedAt: 'FALSE',
        },
      },
    });
  };

  // 당일 유저 회원 가입 갯수 조회
  todayUsers = async (): Promise<number> => {
    const today = new Date();
    return await this.prisma.user.count({
      where: {
        isPublic: 'TRUE',
        AND: [
          {
            createdAt: {
              gte: new Date(dateFormat(today) + ' ' + '00:00:00'),
            },
          },
          {
            createdAt: {
              lte: new Date(dateFormat(today) + ' ' + '23:59:59'),
            },
          },
        ],
        deletedAt: 'FALSE',
      },
    });
  };

  // 오늘 게시글 작성 수 조회
  todayPosts = async (): Promise<number> => {
    const today = new Date();
    return await this.prisma.post.count({
      where: {
        isPublic: 'TRUE',
        AND: [
          {
            createdAt: {
              gte: new Date(dateFormat(today) + ' ' + '00:00:00'),
            },
          },
          {
            createdAt: {
              lte: new Date(dateFormat(today) + ' ' + '23:59:59'),
            },
          },
        ],
        deletedAt: 'FALSE',
        users: {
          deletedAt: 'FALSE',
        },
      },
    });
  };

  // 당일 댓글 작성 갯수 조회
  todayComments = async (): Promise<number> => {
    const today = new Date();
    return await this.prisma.comment.count({
      where: {
        AND: [
          {
            createdAt: {
              gte: new Date(dateFormat(today) + ' ' + '00:00:00'),
            },
          },
          {
            createdAt: {
              lte: new Date(dateFormat(today) + ' ' + '23:59:59'),
            },
          },
        ],
        deletedAt: 'FALSE',
        users: {
          deletedAt: 'FALSE',
        },
      },
    });
  };

  // 당일 댓글 작성 갯수 조회
  todayLikes = async (): Promise<number> => {
    const today = new Date();
    return await this.prisma.like.count({
      where: {
        AND: [
          {
            createdAt: {
              gte: new Date(dateFormat(today) + ' ' + '00:00:00'),
            },
          },
          {
            createdAt: {
              lte: new Date(dateFormat(today) + ' ' + '23:59:59'),
            },
          },
        ],
        users: {
          deletedAt: 'FALSE',
        },
      },
    });
  };

  // 유저 아이디 조회
  findByUserId = async (
    userIds: string[],
  ): Promise<
    {
      id: string;
      nickname: string;
      roles: {
        authority: Authority;
      } | null;
      deletedAt: string;
    }[]
  > => {
    return await this.prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
        isPublic: 'TRUE',
        deletedAt: 'FALSE',
      },
      select: {
        id: true,
        nickname: true,
        roles: {
          select: {
            authority: true,
          },
        },
        deletedAt: true,
      },
      take: 3,
    });
  };
}
