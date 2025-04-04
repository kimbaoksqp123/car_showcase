import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.secret'),
    });
  }

  async validate(payload: any) {
    // Lấy thông tin người dùng từ database dựa vào ID trong token
    const user = await this.usersService.findOne(payload.sub);
    
    // Trả về đối tượng user sẽ được gắn vào request
    return {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    };
  }
} 