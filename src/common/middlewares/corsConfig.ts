import cors from 'cors';
import { SERVER_URL } from '../configs/keys';

export function CorsConfig() {
  const corsOptions = {
    origin: [SERVER_URL],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    // 응답 헤더에 Access-Control-Allow-Credentials 추가
    credentials: true,
    // 응답 상태 204으로 설정
    optionsSuccessStatus: 204,
  } as cors.CorsOptions;

  return cors(corsOptions);
}
