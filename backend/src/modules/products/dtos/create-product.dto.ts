import { Product } from 'generated/prisma';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

type CreateProductType = Omit<
    Product,
    'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'userId'
>;

export class CreateProductDto implements CreateProductType {
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
