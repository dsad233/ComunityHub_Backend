import {
  POST_COMMENT_WEIGHT,
  POST_LIKE_WEIGHT,
  POST_VIEW_WEIGHT,
} from '../common/configs/keys';
import { CategoryType } from '../common/libs/type';
import { CategoriesRepository } from './categories.repository';

export class CategoriesService {
  private readonly categoriesRepository: CategoriesRepository;
  constructor(categoriesRepository: CategoriesRepository) {
    this.categoriesRepository = categoriesRepository;
  }

  // 인기 카테고리 조회
  popularCategory = async () => {
    const posts = await this.categoriesRepository.findByCount();
    const postsSchema = await this.categoriesRepository.findByPostsSchema(
      posts.map((post) => post.id),
    );

    // 인기 게시글 조회
    const topPost = posts
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
          category: post?.category,
          popularCount: popularCount,
        };
      })
      .sort((prop) => {
        if (prop.popularCount > 0) {
          return 1;
        } else if (prop.popularCount < 0) {
          return -1;
        }

        return 0;
      })
      .slice(0, 1);

    let popularCategory = null;

    for (let prop of Object.entries(CategoryType)) {
      if (prop[0] === topPost[0]?.category) {
        popularCategory = prop[1];
      }
    }

    return popularCategory || '자유';
  };
}
