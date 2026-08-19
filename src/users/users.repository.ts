import {
  Authority,
  Category,
  Gender,
  PrismaClient,
  State,
  Type,
} from '../../generated/prisma/client';
import {
  POST_COMMENT_WEIGHT,
  POST_LIKE_WEIGHT,
  POST_VIEW_WEIGHT,
} from '../common/configs/keys';
import { PostsSchema } from '../common/configs/mongodb.config';
import { TPaginationDto } from '../common/dto/paginationDto';
import {
  CommentStatus,
  IsPublicStatus,
  OrderByStatus,
} from '../common/libs/status';
import {
  categoryTranslate,
  contextTranslate,
  parseCreatedAt,
} from '../common/utils';
import {
  TRequestUseCommentDto,
  TRequestUsePostDto,
  TUpdateProfileDto,
  TUpdateUserDto,
} from './dto';

export class UsersRepository {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // 유저 마이페이지 조회
  userInfo = async (
    id: string,
  ): Promise<{
    id: string;
    email: string;
    nickname: string;
    verify: State;
    isPublic: State;
    createdAt: Date;
    roles: { authority: Authority } | null;
    posts: Array<{
      id: string;
      title: string;
      category: Category;
      createdAt: Date;
      _count: {
        comments: number;
        likes: number;
      };
    }>;
    comments: Array<{
      id: string;
      context: string;
      createdAt: Date;
      posts: {
        id: string;
        title: string;
      };
    }>;
    _count: {
      posts: number;
      comments: number;
    };
  } | null> => {
    return await this.prisma.user.findFirst({
      where: { id: id, deletedAt: 'FALSE' },
      select: {
        id: true,
        email: true,
        nickname: true,
        verify: true,
        isPublic: true,
        createdAt: true,
        roles: {
          select: {
            authority: true,
          },
        },
        posts: {
          where: {
            deletedAt: 'FALSE',
          },
          select: {
            id: true,
            title: true,
            category: true,
            createdAt: true,
            _count: {
              select: {
                comments: {
                  where: {
                    deletedAt: 'FALSE',
                  },
                },
                likes: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
        comments: {
          where: {
            userId: id,
            deletedAt: 'FALSE',
          },
          select: {
            id: true,
            context: true,
            createdAt: true,
            posts: {
              select: {
                id: true,
                title: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
        // 댓글 좋아요도 추가예정
        _count: {
          select: {
            posts: {
              where: {
                deletedAt: 'FALSE',
              },
            },
            comments: {
              where: {
                deletedAt: 'FALSE',
              },
            },
          },
        },
      },
    });
  };

  // 유저가 소유하고 있는 게시글 Ids 조회
  findByPostIds = async (id: string): Promise<string[]> => {
    return (
      await this.prisma.post.findMany({
        where: {
          userId: id,
          deletedAt: 'FALSE',
        },
        select: {
          id: true,
        },
      })
    ).map((post) => post.id);
  };

  // 해당 받은 좋아요 수 조회(게시글 좋아요)
  countLikes = async (postIds: string[]): Promise<number> => {
    return await this.prisma.like.count({
      where: {
        postId: {
          in: postIds,
        },
      },
    });
  };

  // 유저가 작성한 모든 게시글 갯수
  writeCountPosts = async (id: string, category: string) => {
    return await this.prisma.post.count({
      where: {
        userId: id,
        category: category as Category,
        deletedAt: 'FALSE',
      },
    });
  };

  // 유저가 작성한 공개, 비공개 별 게시글 갯수
  writeCountStatePosts = async (id: string, status: State) => {
    return await this.prisma.post.count({
      where: {
        userId: id,
        isPublic: status,
        deletedAt: 'FALSE',
      },
    });
  };

  // 유저가 작성한 전체 게시글 조회
  writeUserPosts = async (
    id: string,
    paginations: TPaginationDto,
    query: TRequestUsePostDto,
  ): Promise<
    {
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
    }[]
  > => {
    const where: any = {
      userId: id,
      deletedAt: 'FALSE',
    };

    if (query.search) {
      where['OR'] = [
        {
          title: {
            startsWith: query.search as string,
          },
        },
        {
          context: {
            startsWith: query.search as string,
          },
        },
      ];
    } else if (query.category) {
      where['category'] = query.category;
    } else if (query.isPublic === IsPublicStatus.PUBLIC) {
      where['isPublic'] = 'TRUE';
    } else if (query.isPublic === IsPublicStatus.PRIVATE) {
      where['isPublic'] = 'FALSE';
    }

    let orderBy: any = {};

    if (query.orderBy === OrderByStatus.NEW) {
      orderBy['createdAt'] = 'desc';
    } else if (query.orderBy === OrderByStatus.OLD) {
      orderBy['createdAt'] = 'asc';
    } else if (query.orderBy === OrderByStatus.COMMENTS) {
      orderBy['comments'] = {
        _count: 'desc',
      };
    } else if (query.orderBy === OrderByStatus.LIKES) {
      orderBy['likes'] = {
        _count: 'desc',
      };
      // 좋아요 기준으로 인기 게시글을 지정
    } else if (query.orderBy === OrderByStatus.POPULAR) {
      orderBy['likes'] = {
        _count: 'desc',
      };
    }

    const posts = await this.prisma.post.findMany({
      where,
      select: {
        id: true,
        title: true,
        context: true,
        category: true,
        isPublic: true,
        createdAt: true,
        _count: {
          select: {
            comments: {
              where: {
                deletedAt: 'FALSE',
              },
            },
            likes: true,
          },
        },
      },
      orderBy,
      skip: (Number(paginations.page) - 1) * Number(paginations.pages),
      take: Number(paginations.pages),
    });

    const _postIds = posts.map((post) => post.id);

    // 게시글 조회수 조회
    const postsSchema = await PostsSchema.find({
      _id: { $in: _postIds },
    }).select('_id count');

    const now = new Date();
    if (query.orderBy === OrderByStatus.POPULAR) {
      return posts
        .map((post) => {
          // 인기 가중치 계산 값
          const popularCount =
            post?._count.likes * POST_LIKE_WEIGHT +
            post?._count.comments * POST_COMMENT_WEIGHT +
            (Number(
              postsSchema.find((schema) => schema._id.toString() === post.id)
                ?.count,
            ) || 0 * POST_VIEW_WEIGHT);

          return {
            id: post?.id,
            title: post?.title,
            context: contextTranslate(post?.context),
            category: categoryTranslate(post?.category),
            isPublic: post?.isPublic,
            createdAt: parseCreatedAt(post?.createdAt, now),
            count: {
              comments: post?._count?.comments || 0,
              likes: post?._count?.likes || 0,
              views:
                Number(
                  postsSchema.find((schema) => schema.id.toString() === post.id)
                    ?.count,
                ) || 0,
            },
            popularCount: popularCount,
          };
        })
        .sort((post) => {
          if (post.popularCount > 0) {
            return 1;
          } else if (post.popularCount < 0) {
            return -1;
          }

          return 0;
        })
        .map((post) => {
          return {
            id: post?.id,
            title: post?.title,
            context: post?.context,
            category: post?.category,
            isPublic: post?.isPublic,
            createdAt: post?.createdAt,
            count: post.count,
          };
        });
    }

    return posts.map((post) => {
      return {
        id: post?.id,
        title: post?.title,
        context: contextTranslate(post?.context),
        category: categoryTranslate(post?.category),
        isPublic: post?.isPublic,
        createdAt: parseCreatedAt(post?.createdAt, now),
        count: {
          comments: post?._count?.comments || 0,
          likes: post?._count?.likes || 0,
          views:
            Number(
              postsSchema.find((schema) => schema.id.toString() === post.id)
                ?.count,
            ) || 0,
        },
      };
    });
  };

  // 유저가 작성한 모든 댓글 갯수
  writeCountComments = async (id: string, type: string) => {
    const where: any = {
      userId: id,
    };

    if (type === CommentStatus.COMMENT) {
      where['parentId'] = null;
      where['type'] = 'COMMENT';
    } else if (type === CommentStatus.REPLY) {
      where['parentId'] = {
        not: null,
      };
      where['type'] = 'REPLY';
    }

    return await this.prisma.comment.count({
      where,
    });
  };

  // 유저가 일주일 내에 작성한 모든 댓글 갯수
  writeCountWeekComments = async (id: string) => {
    // 현재 날짜
    const now = new Date();
    return await this.prisma.comment.count({
      where: {
        userId: id,
        OR: [
          {
            createdAt: {
              gte: new Date(now.setDate(now.getDate() - 7)),
            },
          },
          {
            createdAt: {
              lte: now,
            },
          },
        ],
        deletedAt: 'FALSE',
      },
    });
  };

  // 유저가 작성한 모든 대댓글 갯수 조회
  writeCountReplies = async (id: string) => {
    return await this.prisma.comment.count({
      where: {
        userId: id,
        parentId: {
          not: null,
        },
        deletedAt: 'FALSE',
      },
    });
  };

  // 유저가 작성한 댓글 목록 조회
  writeUserComments = async (
    id: string,
    paginations: TPaginationDto,
    query: TRequestUseCommentDto,
  ): Promise<
    {
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
    }[]
  > => {
    const where: any = {
      userId: id,
      deletedAt: 'FALSE',
    };

    if (query.search) {
      where['OR'] = [
        {
          posts: {
            title: {
              startsWith: query.search as string,
            },
          },
        },
        {
          context: {
            startsWith: query.search as string,
          },
        },
      ];
    } else if (query.type === CommentStatus.COMMENT) {
      where['parentId'] = null;
      where['type'] = 'COMMENT';
    } else if (query.type === CommentStatus.REPLY) {
      where['parentId'] = {
        not: null,
      };
      where['type'] = 'REPLY';
    }

    const orderBy: any = {};

    if (query.orderBy === OrderByStatus.NEW) {
      orderBy['createdAt'] = 'desc';
    } else if (query.orderBy === OrderByStatus.OLD) {
      orderBy['createdAt'] = 'asc';
    }

    const comments = await this.prisma.comment.findMany({
      where,
      select: {
        id: true,
        context: true,
        type: true,
        parentId: true,
        createdAt: true,
        posts: {
          select: {
            id: true,
            title: true,
            category: true,
          },
        },
        users: {
          select: {
            nickname: true,
          },
        },
      },
      orderBy,
      skip: (Number(paginations.page) - 1) * Number(paginations.pages),
      take: Number(paginations.pages),
    });

    return comments.map((comment) => {
      const now = new Date();
      return {
        id: comment?.id,
        context: contextTranslate(comment?.context) as string,
        type: comment?.type,
        parentId: comment?.parentId,
        createdAt: parseCreatedAt(comment?.createdAt, now),
        posts: {
          id: comment?.posts.id,
          title: comment?.posts.title,
          category: categoryTranslate(comment?.posts.category),
        },
        users: {
          nickname: comment?.users.nickname,
        },
      };
    });
  };

  // 유저 기존 프로필 정보 조회
  getExistingProfileInfo = async (
    id: string,
  ): Promise<{
    id: string;
    email: string;
    loginId: string | null;
    nickname: string;
    isPublic: State;
  } | null> => {
    return await this.prisma.user.findFirst({
      where: {
        id: id,
        deletedAt: 'FALSE',
      },
      select: {
        id: true,
        email: true,
        loginId: true,
        nickname: true,
        isPublic: true,
      },
    });
  };

  // 유저 기존 정보 조회
  getExistingInfo = async (
    id: string,
  ): Promise<{
    id: string;
    email: string;
    loginId: string | null;
    name: string | null;
    nickname: string;
    gender: Gender | null;
    birthDay: Date | null;
    phoneNumber: string | null;
    address: string | null;
    isPublic: State;
  } | null> => {
    return await this.prisma.user.findFirst({
      where: {
        id: id,
        deletedAt: 'FALSE',
      },
      select: {
        id: true,
        email: true,
        loginId: true,
        name: true,
        nickname: true,
        gender: true,
        birthDay: true,
        phoneNumber: true,
        address: true,
        isPublic: true,
      },
    });
  };

  // 유저 프로필 업데이트
  prifileUpdate = async (
    id: string,
    body: TUpdateProfileDto,
  ): Promise<void> => {
    await this.prisma.user.update({
      where: {
        id: id,
        deletedAt: 'FALSE',
      },
      data: {
        nickname: body.nickname,
        isPublic: body.isPublic,
      },
    });
  };

  // 유저 정보 업데이트
  update = async (id: string, body: TUpdateUserDto): Promise<void> => {
    await this.prisma.user.update({
      where: {
        id: id,
        deletedAt: 'FALSE',
      },
      data: {
        name: body.name,
        nickname: body.nickname,
        gender: body.gender as Gender,
        birthDay: body.birthDay as Date,
        phoneNumber: body.phoneNumber as string,
        address: body.address as string,
        isPublic: body.isPublic,
      },
    });
  };

  // 유저 회원 탈퇴
  remove = async (id: string): Promise<void> => {
    await this.prisma.user.update({
      where: {
        id: id,
        deletedAt: 'FALSE',
      },
      data: {
        deletedAt: 'TRUE',
      },
    });
  };

  /**
   * 유저 프로필 이미지 관련
   */

  // 프로필 이미지 설정
  createProfileImage = async (id: string, image: string): Promise<void> => {
    const imageBuffer = Buffer.from(image, 'base64');
    await this.prisma.image.create({
      data: {
        image: new Uint8Array(imageBuffer.buffer),
        type: 'USER',
        typeId: id,
      },
    });
  };

  // 이미지 조회
  getImage = async (
    id: string,
  ): Promise<{
    id: string;
    image: string | null;
  } | null> => {
    const image = await this.prisma.image.findFirst({
      where: {
        type: 'USER',
        typeId: id,
      },
      select: {
        id: true,
        image: true,
      },
    });

    return image
      ? {
          id: image?.id,
          image: image?.image
            ? Buffer.from(image?.image as Uint8Array).toString('base64')
            : null,
        }
      : null;
  };

  // 프로필 이미지 업데이트
  imageUpdate = async (
    id: string,
    imageId: string,
    image: string,
  ): Promise<void> => {
    const imageBuffer = Buffer.from(image, 'base64');
    await this.prisma.image.update({
      where: {
        id: imageId,
        type: 'USER',
        typeId: id,
      },
      data: {
        image: new Uint8Array(imageBuffer.buffer),
      },
    });
  };

  // 프로필 이미지 제거
  imageRemove = async (id: string, imageId: string): Promise<void> => {
    await this.prisma.image.delete({
      where: {
        id: imageId,
        type: 'USER',
        typeId: id,
      },
    });
  };
}
