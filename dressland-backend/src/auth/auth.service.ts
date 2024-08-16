import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  generateToken(user) {
    console.log('authservice generate token', user);
    // if role is superuser then set expiry to 30 mins
    // else set expiry to 1 day
    if (user.role == 'superuser') {
      return this.jwtService.sign({ user }, { expiresIn: '30m' });
    }
    return this.jwtService.sign({ user });
  }
}
