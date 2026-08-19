import { BadRequest, NotFound } from 'http-errors';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import {
  GOOGLE_CALLBACK_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET_KEY,
} from '../configs/keys';
import { prisma } from '../configs/prisma-client';
import { Gender, State } from '../../../generated/prisma/enums';
import { StatusCodes } from 'http-status-codes';

export function GoogleStrategy(): Strategy {
  return new Strategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET_KEY,
      callbackURL: GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      cb: VerifyCallback,
    ) => {
      if (!profile) {
        throw new BadRequest(
          'Google 로그인에 실패했습니다. 다시 시도해 주세요.',
        );
      }

      if (!profile._json.email_verified) {
        throw new BadRequest(
          '이메일 인증이 완료되지 않은 계정입니다. 이메일 인증 후 다시 시도해 주세요.',
        );
      }

      // 요청이 들어온 구글 계정이 유효한 계정인지 확인
      const response = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?access_token=${accessToken}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status === StatusCodes.NOT_FOUND) {
        throw new NotFound(
          '유효하지 않은 구글 계정입니다. 다시 시도해 주세요.',
        );
      } else if (response.status === StatusCodes.BAD_REQUEST) {
        throw new BadRequest('올바르지 않은 요청 입니다. 다시 시도해 주세요.');
      }

      if (!response.ok) {
        throw new NotFound(
          '정상적으로 처리되지 않았습니다. 다시 시도해 주세요.',
        );
      }

      const resJson = await response.json();

      if (new Date().getDate() > Number(resJson.exp)) {
        throw new BadRequest('유효하지 않은 접근 입니다. 다시 시도해 주세요.');
      }

      const session = {
        email: profile._json.email?.trim(),
        nickname: profile.displayName.trim(),
        accessToken: accessToken,
        email_verified: profile._json.email_verified,
      } as {
        email: string;
        nickname: string;
        accessToken: string;
        email_verified: boolean;
      };

      const alreadyEmail = await existEmail(session.email);
      if (alreadyEmail) {
        const user = await getUser(session);

        if (user) {
          return cb(null, user);
        }
      }

      return cb(null, session);
    },
  );
}

// 유저 정보 반환
async function getUser(payload: {
  email: string;
  nickname: string;
  accessToken: string;
  email_verified: Boolean;
}): Promise<{
  id: string;
  email: string;
  loginId: string | null;
  name: string | null;
  nickname: string;
  gender: Gender | null;
  birthDay: Date | null;
  phoneNumber: string | null;
  isPublic: State;
  verify: State;
} | null> {
  const user = await prisma.user.findFirst({
    where: {
      email: payload.email,
      nickname: payload.nickname,
      deletedAt: 'FALSE',
    },
    select: {
      id: true,
      email: true,
      loginId: true,
      name: true,
      nickname: true,
      gender: true,
      birthDay: true,
      phoneNumber: true,
      isPublic: true,
      verify: true,
    },
  });

  return user;
}

// 중복 이메일 유무 체크
async function existEmail(email: string): Promise<{ email: string } | null> {
  return await prisma.user.findFirst({
    where: { email: email },
    select: { email: true },
  });
}
