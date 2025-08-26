import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { logInDto } from './dtos/logIn.dto';
import { SignUpDto } from './dtos/signUp.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('logIn')
    logIn(@Body() logInData: logInDto) {
        return this.authService.logIn(logInData);
    }

    @Post('SignUp')
    signUp(@Body() signUpData: SignUpDto) {
        return this.authService.signUp(signUpData);
    }
}
