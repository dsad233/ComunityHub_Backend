import { BadRequest } from 'http-errors';
import { regEx } from '../../common/utils';

export type TRequestReplyCommentCreateDto = {
  id: string;
  parentId: string;
};

export async function RequestReplyCommentCreateDto({
  id,
  parentId,
}: TRequestReplyCommentCreateDto): Promise<TRequestReplyCommentCreateDto> {
  if (!id) {
    throw new BadRequest('게시글 ID가 존재하지 않습니다. 다시 시도 해주세요.');
  }

  if (!parentId) {
    throw new BadRequest('댓글 ID가 존재하지 않습니다. 다시 시도 해주세요.');
  }

  if (!id.trim().match(regEx.uuidv4)) {
    throw new BadRequest('유효하지 않은 게시글 ID 형식입니다.');
  }

  if (!parentId.trim().match(regEx.uuidv4)) {
    throw new BadRequest('유효하지 않은 댓글 ID 형식입니다.');
  }

  return {
    id: id.trim(),
    parentId: parentId?.trim(),
  };
}
