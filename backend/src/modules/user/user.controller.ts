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
import { UpdateUserDto } from './dtos/updateUser.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

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
