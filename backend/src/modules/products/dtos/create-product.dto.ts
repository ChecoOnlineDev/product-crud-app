import { Product } from 'generated/prisma';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

type CreateProductType = Omit<
    Product,
    'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export class CreateProductDto implements CreateProductType {
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    description: string | null;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsOptional()
    @IsString()
    image: string | null;
}
