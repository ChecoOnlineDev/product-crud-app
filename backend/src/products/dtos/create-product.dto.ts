import { Product } from 'generated/prisma';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

type CreateProductType = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

export class CreateProductDto implements CreateProductType {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description: string | null;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsOptional()
    @IsString()
    image: string | null;
}
