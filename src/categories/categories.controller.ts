import { Request, Response } from 'express';
import { CategoriesService } from './categories.service';
import { StatusCodes } from 'http-status-codes';
import { Category } from '../../generated/prisma/enums';

export class CategoriesController {
  private readonly categoriesService: CategoriesService;
  constructor(categoriesService: CategoriesService) {
    this.categoriesService = categoriesService;
  }

  // 인기 카테고리 조회
  popularCategory = async (
    req: Request,
    res: Response,
  ): Promise<Response<{ message: string; category: Category }>> => {
    return res.status(StatusCodes.OK).json({
      message: '인기 카테고리 조회 완료.',
      category: await this.categoriesService.popularCategory(),
    });
  };
}
