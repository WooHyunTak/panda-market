import { JwtService } from '@nestjs/jwt';

interface Payload {
  id: string;
  email: string;
  nickname: string;
}

export default function createToken(
  payload: Payload,
  type: 'access' | 'refresh',
) {
  const jwtPayload = {
    id: payload.id,
    email: payload.email,
    nickname: payload.nickname,
  };

  const jwtService = new JwtService();
  const expiresIn = type === 'access' ? '1h' : '7d';
  const secret = process.env.JWT_SECRET;

  return jwtService.sign(jwtPayload, { secret, expiresIn });
}
