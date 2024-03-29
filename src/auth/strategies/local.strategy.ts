import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { LoggerWinston } from '../../logger/logger-winston.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private readonly logger: LoggerWinston,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      this.logger.warn(`User error: user with email = ${email} not found or entered incorrect password.`, 'LocalStrategy');
      throw new UnauthorizedException();
    }
    return user;
  }
}
