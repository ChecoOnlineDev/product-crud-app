import { Body, Controller, Delete, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from 'src/common/classes/jwt-payload.class';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Patch('updateUser')
    updateUser(
        @Body() updateUserData: UpdateUserDto,
        @CurrentUser() user: JwtPayload,
    ) {
        return this.userService.updateUser(user.userId, updateUserData);
    }

    @Delete('deleteUser')
    deleteUser(@CurrentUser() user: JwtPayload) {
        return this.userService.deleteUser(user.userId);
    }
}
