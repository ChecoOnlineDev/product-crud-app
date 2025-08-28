import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';

import { Prisma } from 'generated/prisma';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    //Usado para el servicio signUp en el modulo de autenticacion
    async createUser(data: Prisma.UserCreateInput) {
        return this.prisma.user.create({ data });
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

    async findByEmail(userEmail: string) {
        return await this.prisma.user.findUnique({
            where: {
                email: userEmail,
            },
        });
    }

    async findByUsername(username: string) {
        return await this.prisma.user.findUnique({
            where: {
                username: username,
            },
        });
    }
}
