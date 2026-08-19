import { BadRequest } from 'http-errors';
import {
  CategoryStatus,
  IsPublicStatus,
  OrderByStatus,
} from '../../common/libs/status';

export type TRequestUsePostDto = {
  search?: string | undefined;
  category?: string | undefined;
  isPublic: string;
  orderBy: string;
};

export async function RequestUsePostDto({
  search,
  category,
  isPublic,
  orderBy,
}: TRequestUsePostDto): Promise<TRequestUsePostDto> {
  if (!category) {
    throw new BadRequest(
      'category 파라미터 값이 존재하지 않습니다. 다시 요청해 주세요.',
    );
  }

  if (!isPublic) {
    throw new BadRequest(
      'isPublic 파라미터 값이 존재하지 않습니다. 다시 요청해 주세요.',
    );
  }

  if (!orderBy) {
    throw new BadRequest(
      'orderBy 파라미터 값이 존재하지 않습니다. 다시 요청해 주세요.',
    );
  }

  if (category) {
    if (!Object.values(CategoryStatus).toString().includes(category)) {
      throw new BadRequest(
        '올바르지 않은 카테고리 값 입니다. 다시 입력해 주세요.',
      );
    }
  }

  if (isPublic) {
    if (!Object.values(IsPublicStatus).toString().includes(isPublic)) {
      throw new BadRequest(
        '공개, 비공개 여부가 올바르지 않은 값 입니다. 다시 입력해 주세요.',
      );
    }
  }

  if (orderBy) {
    if (!Object.values(OrderByStatus).toString().includes(orderBy)) {
      throw new BadRequest('올바르지 않은 정렬 값 입니다. 다시 입력해 주세요.');
    }
  }

  return {
    search: search?.trim(),
    category:
      category && category.trim() !== 'ALL' ? category.trim() : undefined,
    isPublic: isPublic.trim(),
    orderBy: orderBy.trim(),
  };
}
