import bcrypt from 'bcrypt';
import { BCYPT_PASSWORD_SALT } from './configs/keys';
import { AuthorityType, CategoryType } from './libs/type';
import fs from 'fs';
import path from 'path';
import { Authority } from '../../generated/prisma/enums';

/**
 * 패스워드 관련
 */

// 패스워드 해쉬화
export async function hashPassword(password: string): Promise<string> {
  const hashPassword = await bcrypt.hash(password, BCYPT_PASSWORD_SALT);
  return hashPassword;
}

// 패스워드 복호화
export async function comparePassword(
  bodyPassword: string,
  hashPassword: string,
): Promise<boolean> {
  const compare = await bcrypt.compare(bodyPassword, hashPassword);
  if (!compare) {
    return false;
  }

  return true;
}

// 랜덤 비밀번호 길이 생성 (6 ~ 8자리)
export async function createRandomPassword(): Promise<string> {
  const randomLength = Math.floor(Math.random() * (8 - 6 + 1)) + 6;
  let randomPassword = '';

  for (let i = 0; i < randomLength; i++) {
    // 1 숫자
    // 2 대문자
    // 3 소문자
    const randomProp = Math.floor(Math.random() * 3) + 1;

    switch (randomProp) {
      case 1:
        randomPassword += Math.floor(Math.random() * 10).toString();
        break;
      case 2:
        randomPassword += String.fromCharCode(
          Math.floor(Math.random() * (90 - 65 + 1)) + 65,
        );
        break;
      default:
        randomPassword += String.fromCharCode(
          Math.floor(Math.random() * (122 - 97 + 1)) + 97,
        );
        break;
    }
  }

  if (randomPassword.length > 0) {
    randomPassword = await hashPassword(randomPassword);
  }

  return randomPassword;
}

// 정규식
export const regEx = {
  email:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  password: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
  date: /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
  phoneNumber:
    /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
  uuidv4:
    /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i,
} as const;

// 랜덤 상수 함수
export function randomConst(): number {
  return Math.floor(100000 + Math.random() * 900000);
}

/**
 * 날짜 관련 함수
 */

// 날짜 포맷팅 함수
export function dateFormat(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const formatterMonth = month < 10 ? '0' + month : month;
  const formatterDay = day < 10 ? '0' + day : day;

  return year + '-' + formatterMonth + '-' + formatterDay;
}

// 시간 포맷팅 함수
export function timeFormat(date: Date): string {
  const hour = date.getHours();
  const minute = date.getMinutes();
  const formatterHour = hour < 10 ? '0' + hour : hour;
  const formatterMinute = minute < 10 ? '0' + minute : minute;

  return formatterHour + ':' + formatterMinute;
}

// 날짜 사이의 차이를 계산하는 함수
export function getDaysDifference(startDate: Date, endDate: Date): number {
  // 두 날짜 간의 시간 차이를 밀리초 단위로 계산합니다.
  const diffTime = endDate.getTime() - startDate.getTime();

  // 밀리초를 일 단위로 변환합니다.
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  // 일수 차이를 반환합니다.
  return Math.floor(diffDays);
}

// 시간 차이를 계산하는 함수
export function getTodayDifferTime(startDate: Date, endDate: Date): string {
  // 시간 + 분
  const totalMinutes =
    Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);

  if (hours > 0) {
    return hours + '시간 전';
  }

  if (hours === 0 && minutes > 0) {
    return minutes + '분 전';
  }

  return '방금 전';
}

// 날짜 분기처리 함수
export function parseCreatedAt(startDate: Date, endDate: Date): string {
  let diffDate = '';

  // 게시 30일 이상
  if (getDaysDifference(startDate, endDate) > 30) {
    diffDate = dateFormat(startDate);
    // 게시 2일 이후, 30일 전
  } else if (
    getDaysDifference(startDate, endDate) >= 1 &&
    getDaysDifference(startDate, endDate) <= 30
  ) {
    diffDate = `${getDaysDifference(startDate, endDate)}일 전`;
  } else if (getDaysDifference(startDate, endDate) === 0) {
    diffDate = getTodayDifferTime(startDate, endDate);
  }

  return diffDate;
}

/**
 * 게시글 관련 함수
 */

// 카테고리 번역 함수
export function categoryTranslate(category: string): {
  key: string;
  name: string;
} {
  let transCategory: any = {};
  for (let prop of Object.entries(CategoryType)) {
    if (category === prop[0]) {
      transCategory['key'] = prop[0];
      transCategory['name'] = prop[1];
      break;
    }
  }

  return transCategory;
}

// 게시글 내용 표시 제한 함수
export function contextTranslate(html: string | null): string | null {
  // html tag 제거 처리
  let contextStr = html ? html.replace(/(<([^>]+)>)/gi, '\n') : null;

  if (contextStr) {
    // &nbsp; 공백 유효시, 공백 제거후 리턴
    if (contextStr.indexOf('&nbsp;') !== -1) {
      contextStr = contextStr.slice(0, contextStr.indexOf('&nbsp;')) + '...';

      return contextStr;
    }

    // 게시글 내용이 표기 범위를 초과할 때, 글자 제한 처리
    if (contextStr.length > 100) {
      contextStr = contextStr.slice(0, 100) + '...';

      return contextStr;
    }
  }

  return contextStr;
}

/**
 * 기타 함수 목록
 */

// 비속어 텍스트 목록
export const filterTexts = fs.readFileSync(
  path.join(__dirname, './filter_text.txt'),
  'utf-8',
) as string;

// 권한명 번역 함수
export function transRoleName(role: Authority): string | undefined {
  for (let prop of Object.entries(AuthorityType)) {
    if (prop[0] === role) {
      return prop[1];
    }
  }
}
