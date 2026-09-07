import { Response, Request } from 'express';
import { ipKeyGenerator, rateLimit } from 'express-rate-limit';
import { StatusCodes } from 'http-status-codes';

const ipv6Subnet = 56;

export function rateLimitConfig() {
  return rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    limit: 1000,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: ipv6Subnet,
    validate: {
      ipv6SubnetOrKeyGenerator: false,
    },
    handler: (_: Request, res: Response) => {
      return res.status(StatusCodes.TOO_MANY_REQUESTS).json({
        message: '너무 많은 요청이 발생하였습니다. 잠시 후 다시 시도해주세요.',
      });
    },
    keyGenerator: (req: Request): string => {
      if (req.ips[0]) {
        return ipKeyGenerator(req.ips[0] as string, ipv6Subnet);
      }

      return ipKeyGenerator(req.ip as string, ipv6Subnet);
    },
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
  });
}
