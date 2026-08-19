import { BadRequest } from 'http-errors';
import { Category, State } from '../../../generated/prisma/enums';

export type TUpdatePostDto = {
  title: string;
  context?: string | null;
  category: Category;
  isPublic: State;
  images?: string[] | string | undefined;
};

export async function UpdatePostDto({
  title,
  context,
  category,
  isPublic,
  images,
}: TUpdatePostDto): Promise<TUpdatePostDto> {
  if (!title) {
    throw new BadRequest('제목란을 작성해 주세요.');
  }

  if (!isPublic) {
    throw new BadRequest('공개, 비공개란을 선택해 주세요.');
  }

  if (!category) {
    throw new BadRequest('카테고리란을 선택해 주세요.');
  }

  if (title) {
    if (title.trim().length < 1 || title.trim().length > 300) {
      throw new BadRequest(
        '게시글 제목은 2자 이상 300자 이하로 입력해 주세요.',
      );
    }
  }

  if (isPublic) {
    if (!Object.values(State).includes(isPublic)) {
      throw new BadRequest(
        '공개, 비공개 여부가 올바르지 않은 값 입니다. 다시 입력해 주세요.',
      );
    }
  }

  if (category) {
    if (!Object.values(Category).includes(category)) {
      throw new BadRequest(
        '올바르지 않은 카테고리 값 입니다. 다시 입력해 주세요.',
      );
    }
  }

  return {
    title: title.trim(),
    context: context?.trim() || null,
    category: category,
    isPublic: isPublic,
    images: images,
  };
}
