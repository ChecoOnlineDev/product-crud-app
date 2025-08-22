import {
    Body,
    Controller,
    Delete,
    Param,
    ParseIntPipe,
    Patch,
    Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpDto } from './dtos/signUp.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('signUp')
    signUp(@Body() signUpUserData: SignUpDto) {
        return this.userService.signUp(signUpUserData);
    }

    @Patch('updateUser/:id')
    updateUser(
        @Body() updateUserData: UpdateUserDto,
        @Param('id', ParseIntPipe) userId: number,
    ) {
        return this.userService.updateUser(userId, updateUserData);
    }

    @Delete('deleteUser/:id')
    deleteUser(@Param('id', ParseIntPipe) userId: number) {
        return this.userService.deleteUser(userId);
    }
}
