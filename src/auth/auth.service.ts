import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  generateAuthToken(user: any) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      type: user.type,
    };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_TOKEN_SECRET,
      expiresIn: process.env.JWT_TONE_EXPIRY_TIME,
    });
  }
}
