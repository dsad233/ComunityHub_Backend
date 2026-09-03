import { BadRequest } from 'http-errors';
import { AuthEmailStatus } from '../../common/libs/status';

export type TAuthEmailDto = {
  type: AuthEmailStatus;
  code: number;
};

export async function AuthEmailDto({
  type,
  code,
}: TAuthEmailDto): Promise<TAuthEmailDto> {
  if (!type || !Object.values(AuthEmailStatus).toString().includes(type)) {
    throw new BadRequest('인증 타입이 올바르지 않습니다. 다시 시도해 주세요.');
  }

  if (!code) {
    throw new BadRequest(
      '인증 코드 타입이 올바르지 않습니다. 다시 시도해 주세요.',
    );
  }

  if (`${code}`.length !== 6) {
    throw new BadRequest('인증 코드가 변형되었습니다. 다시 시도해 주세요.');
  }

  return {
    type: type,
    code: typeof code === 'string' ? Number(code) : code,
  };
}
