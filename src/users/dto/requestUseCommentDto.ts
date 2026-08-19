import { BadRequest } from 'http-errors';

export type TRequestUseCommentDto = {
  search?: string | undefined;
  orderBy: string;
  type: string;
};

export async function RequestUseCommentDto({
  search,
  orderBy,
  type,
}: TRequestUseCommentDto): Promise<TRequestUseCommentDto> {
  if (!orderBy) {
    throw new BadRequest(
      'orderBy 파라미터 값이 존재하지 않습니다. 다시 요청해 주세요.',
    );
  }

  if (!type) {
    throw new BadRequest(
      'type 파라미터 값이 존재하지 않습니다. 다시 요청해 주세요.',
    );
  }

  return {
    search: search?.trim(),
    orderBy: orderBy.trim(),
    type: type.trim(),
  };
}
