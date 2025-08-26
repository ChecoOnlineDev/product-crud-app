import { PartialType } from '@nestjs/swagger';
import { SignUpDto } from '../../auth/dtos/signUp.dto';

export class UpdateUserDto extends PartialType(SignUpDto) {}
