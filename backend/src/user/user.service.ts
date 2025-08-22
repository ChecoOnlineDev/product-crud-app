import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from './dtos/signUp.dto';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async signUp(signUpUserData: SignUpDto) {
        const userExists = await this.prisma.user.findUnique({
            where: {
                email: signUpUserData.email,
            },
        });
        if (userExists) {
            throw new BadRequestException('El usuario ya existe');
        }
        const hashedPassword = await bcrypt.hash(signUpUserData.password, 10);
        const newUser = await this.prisma.user.create({
            data: {
                email: signUpUserData.email,
                username: signUpUserData.username,
                password: hashedPassword,
            },
        });

        const { password, ...userWhitoutPassword } = newUser;
        return userWhitoutPassword;
    }

    async updateUser(userId: number, updateUserData: UpdateUserDto) {
        try {
            const updateUser = await this.prisma.user.update({
                where: {
                    id: userId,
                },
                data: updateUserData,
            });
            const { password, ...userWithoutPassword } = updateUser;
            return userWithoutPassword;
        } catch (error) {
            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === 'P2025'
            ) {
                throw new NotFoundException(
                    `El usuario con el ID ${userId} no fue encontrado.`,
                );
            }
            throw error;
        }
    }

    async deleteUser(userId: number) {
        try {
            await this.prisma.user.delete({
                where: {
                    id: userId,
                },
            });
            return {
                message: `El usuario con el id ${userId} ha sido eliminado exitosamente`,
            };
        } catch (error) {
            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code == 'P2025'
            ) {
                throw new NotFoundException(
                    `El usuario con el id ${userId} no puede ser eliminado porque no se ha encontrado`,
                );
            }
        }
    }
}
