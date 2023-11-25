import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.usersService.getAuthUser(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.username };
    return {
      ...user,
      token: await this.jwtService.signAsync(payload),
    };
  }

  async login(user: any) {
    const { id, username } = user;
    const payload = { username: username, sub: id };
    return {
      id,
      token: this.jwtService.sign(payload),
    };
  }
}
