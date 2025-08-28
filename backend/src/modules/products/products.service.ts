import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { ProductResponseDto } from './dtos/product-response.dto';
import { plainToInstance } from 'class-transformer';
import { error } from 'console';

@Injectable()
export class ProductsService {
    constructor(private readonly prisma: PrismaService) {}

    // Obtiene todos los productos que pertenecen al usuario especificado por su `userId`.
    async getAllProducts(userId: number): Promise<ProductResponseDto[]> {
        const allProducts = await this.prisma.product.findMany({
            where: {
                userId: userId,
            },
        });
        if (!allProducts.length) {
            throw new NotFoundException(
                `Actualmente no hay tareas registradas`,
            );
        }
        return allProducts.map((product) =>
            plainToInstance(ProductResponseDto, product),
        );
    }

    // Obtiene un producto específico por su 'productId', asegurando que pertenezca al usuario especificado por 'userId'.
    async getProductById(
        userId: number,
        productId: number,
    ): Promise<ProductResponseDto> {
        const product = await this.prisma.product.findFirst({
            where: {
                id: productId,
                userId: userId,
            },
        });
        if (!product) {
            throw new NotFoundException(
                `El producto con el Id ${productId} no existe.`,
            );
        }
        return plainToInstance(ProductResponseDto, product);
        //transformar el formato de fecha a local string
    }

    async createProduct(
        createProductData: CreateProductDto,
        userId: number,
    ): Promise<ProductResponseDto> {
        try {
            const createProduct = await this.prisma.product.create({
                data: {
                    ...createProductData,
                    userId: userId,
                },
            });
            return plainToInstance(ProductResponseDto, createProduct);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ConflictException(
                        `El producto con el nombre ${createProductData.name} ya existe.`,
                    );
                }
            }
        }
        throw error;
    }

    async updateProduct(
        productId: number,
        updateProductData: UpdateProductDto,
        userId: number,
    ): Promise<ProductResponseDto> {
        try {
            const updateProduct = await this.prisma.product.update({
                where: {
                    id: productId,
                    userId: userId,
                },
                data: updateProductData,
            });
            return plainToInstance(ProductResponseDto, updateProduct);
        } catch (error) {
            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === 'P2025'
            ) {
                throw new NotFoundException(
                    `El producto con el Id ${productId} no puede ser actualizado porque no ha sido encontrado`,
                );
            }
            throw error;
        }
    }

    async deleteProduct(productId: number, userId: number) {
        try {
            await this.prisma.product.delete({
                where: {
                    id: productId,
                    userId: userId,
                },
            });
            return `El producto con el Id ${productId} ha sido eliminado correctamente.`;
        } catch (error) {
            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === 'P2025'
            ) {
                throw new NotFoundException(
                    `El producto con el Id ${productId} no puede ser eliminado porque no ha sido encontrado`,
                );
            }
            throw error;
        }
    }

    async deleteAllProducts(userId: number) {
        await this.prisma.product.deleteMany({
            where: {
                userId: userId,
            },
        });
        return 'Todos los registros de la tabla han sido eliminados correctamente';
    }

    //Diseñada para postgresql
    async resetAllProducts() {
        try {
            await this.prisma.$executeRawUnsafe(
                `TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE;`,
            );
            return 'La tabla ha sido reseteada correctamente.';
        } catch (error) {
            console.error('Error al resetear la tabla:', error);
            throw new Error('No se pudo resetear la tabla de productos.');
        }
    }
}
