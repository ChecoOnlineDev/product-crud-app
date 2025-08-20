import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/signUp.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signUp')
    signUp(@Body() registerData: SignUpDto) {
        return this.authService.signUp(registerData);
    }
}
