import { PartialType } from '@nestjs/swagger';
import { SignUpDto } from './signUp.dto';

export class UpdateUserDto extends PartialType(SignUpDto) {}
