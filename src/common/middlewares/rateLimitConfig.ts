import { Request } from 'express';
import { rateLimit } from 'express-rate-limit';
import { StatusCodes } from 'http-status-codes';

export function rateLimitConfig() {
  return rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    limit: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56,
    statusCode: StatusCodes.TOO_MANY_REQUESTS,
    message: '너무 많은 요청이 발생하였습니다. 잠시 후 다시 시도해주세요.',
    keyGenerator: (req: Request) => req.ip || (req.ips[0] as string),
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
  });
}
