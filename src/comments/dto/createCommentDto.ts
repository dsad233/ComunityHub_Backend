import { BadRequest } from 'http-errors';

export type TCreateCommentDto = {
  context: string;
};

export async function CreateCommentDto({
  context,
}: TCreateCommentDto): Promise<TCreateCommentDto> {
  if (!context) {
    throw new BadRequest('댓글 내용란을 입력해 주세요.');
  }

  return {
    context: context.trim(),
  };
}
