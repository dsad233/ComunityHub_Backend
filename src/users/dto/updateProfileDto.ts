import { BadRequest } from 'http-errors';
import { State } from '../../../generated/prisma/enums';

export type TUpdateProfileDto = {
  image?: string | null;
  nickname: string;
  isPublic: State;
};

export async function UpdateProfileDto({
  image,
  nickname,
  isPublic,
}: TUpdateProfileDto): Promise<TUpdateProfileDto> {
  if (!nickname) {
    throw new BadRequest('닉네임을 입력해 주세요.');
  }

  if (isPublic) {
    if (!Object.values(State).includes(isPublic)) {
      throw new BadRequest(
        '공개, 비공개 여부가 올바르지 않은 값 입니다. 다시 입력해 주세요.',
      );
    }
  }

  return {
    image: image?.trim() || null,
    nickname: nickname.trim(),
    isPublic: isPublic,
  };
}
