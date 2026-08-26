import { BadRequest } from 'http-errors';
import { Gender, State } from '../../../generated/prisma/enums';
import { regEx } from '../../common/utils';

export type TUpdateUserDto = {
  name?: string | null;
  nickname: string;
  gender?: Gender | null;
  birthDay?: Date | null;
  phoneNumber?: string | null;
  address?: string | null;
  isPublic: State;
};

export async function UpdateUserDto({
  name,
  nickname,
  gender,
  birthDay,
  phoneNumber,
  address,
  isPublic,
}: TUpdateUserDto): Promise<TUpdateUserDto> {
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

  if (name) {
    if (name.trim().length < 1 || name.trim().length > 50) {
      throw new BadRequest('이름은 2자 이상 50자 이하로 입력해 주세요.');
    }
  }

  if (nickname.trim().length < 1 || nickname.trim().length > 32) {
    throw new BadRequest('닉네임은 2자 이상 32자 이하로 입력해 주세요.');
  }

  if (gender) {
    if (![Gender.MALE, Gender.FEMALE].includes(gender as Gender)) {
      throw new BadRequest('성별은 남자, 여자를 입력해 주세요.');
    }
  }

  if (birthDay) {
    if (!String(birthDay).trim().match(regEx.date)) {
      throw new BadRequest(
        '생년월일 형식이 올바르지 않습니다. 다시 입력해 주세요.',
      );
    }
  }

  if (phoneNumber) {
    if (
      !phoneNumber.trim().match(regEx.phoneNumber) ||
      phoneNumber.trim().length > 15
    ) {
      throw new BadRequest(
        '전화번호 형식이 올바르지 않습니다. 15자 이하로 입력해 주세요.',
      );
    }
  }

  if (address) {
    if (address?.trim().length < 1 || address?.trim().length > 100) {
      throw new BadRequest('주소는 2자 이상 100자 이하로 입력해 주세요.');
    }
  }

  return {
    name: name?.trim() || null,
    nickname: nickname.trim(),
    gender: gender || null,
    birthDay: (birthDay && new Date(birthDay)) || null,
    phoneNumber: phoneNumber?.trim() || null,
    address: address?.trim() || null,
    isPublic: isPublic,
  };
}
