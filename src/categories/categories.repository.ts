import type { Types } from 'mongoose';
import { Category, PrismaClient } from '../../generated/prisma/client';
import { PostsSchema } from '../common/configs/mongodb.config';

export class CategoriesRepository {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // 게시글 댓글 수, 게시글 좋아요 조회
  findByCount = async (): Promise<
    {
      id: string;
      category: Category;
      _count: {
        likes: number;
        comments: number;
      };
    }[]
  > => {
    return await this.prisma.post.findMany({
      where: {
        isPublic: 'TRUE',
        deletedAt: 'FALSE',
      },
      select: {
        id: true,
        category: true,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        likes: {
          _count: 'desc',
        },
      },
      take: 10,
    });
  };

  // 괸련된 게시글 조회수들을 조회
  findByPostsSchema = async (
    postIds: string[],
  ): Promise<
    {
      _id: Types.UUID;
      count: BigInt;
    }[]
  > => {
    return await PostsSchema.find({ _id: { $in: postIds } })
      .select('_id count')
      .limit(10);
  };
}
