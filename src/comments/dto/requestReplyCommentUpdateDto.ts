import { BadRequest } from 'http-errors';
import { regEx } from '../../common/utils';

export type TRequestReplyCommentUpdateDto = {
  id: string;
  parentId: string;
  replyId: string;
};

export async function RequestReplyCommentUpdateDto({
  id,
  parentId,
  replyId,
}: TRequestReplyCommentUpdateDto): Promise<TRequestReplyCommentUpdateDto> {
  if (!id) {
    throw new BadRequest('게시글 ID가 존재하지 않습니다. 다시 시도해 주세요.');
  }

  if (!parentId) {
    throw new BadRequest('댓글 ID가 존재하지 않습니다. 다시 시도해 주세요.');
  }

  if (!replyId) {
    throw new BadRequest('대댓글 ID가 존재하지 않습니다. 다시 시도해 주세요.');
  }

  if (!id.trim().match(regEx.uuidv4)) {
    throw new BadRequest('유효하지 않은 게시글 ID 형식입니다.');
  }

  if (!parentId.trim().match(regEx.uuidv4)) {
    throw new BadRequest('유효하지 않은 댓글 ID 형식입니다.');
  }

  if (!replyId.trim().match(regEx.uuidv4)) {
    throw new BadRequest('유효하지 않은 대댓글 ID 형식입니다.');
  }

  return {
    id: id.trim(),
    parentId: parentId.trim(),
    replyId: replyId.trim(),
  };
}
