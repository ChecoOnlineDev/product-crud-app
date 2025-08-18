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

    async getAllProducts(): Promise<ProductResponseDto[]> {
        const allProducts = await this.prisma.product.findMany();
        return allProducts.map((product) =>
            plainToInstance(ProductResponseDto, product),
        );
    }

    async getProductById(productId: number): Promise<ProductResponseDto> {
        const product = await this.prisma.product.findUnique({
            where: {
                id: productId,
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
    ): Promise<ProductResponseDto> {
        try {
            const createProduct = await this.prisma.product.create({
                data: createProductData,
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
    ): Promise<ProductResponseDto> {
        try {
            const updateProduct = await this.prisma.product.update({
                where: {
                    id: productId,
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

    async deleteProduct(productId: number) {
        try {
            await this.prisma.product.delete({
                where: {
                    id: productId,
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

    async deleteAllProducts() {
        await this.prisma.product.deleteMany();
        return 'Todos los registros de la tabla han sido eliminados correctamente';
    }

    //Solo funciona para Sqlite, de querer usar otro motor db, usar truncate en lugar de DELETE FROM
    async resetAllProducts() {
        await this.prisma.$transaction([
            this.prisma.product.deleteMany(),
            this.prisma.$executeRawUnsafe(
                `DELETE FROM "sqlite_sequence" WHERE "name" = "Product"`,
            ),
        ]);
        return 'La tabla ha sido reseteada correctamente.';
    }
}
