import { Expose, Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Product } from 'generated/prisma';

export class ProductResponseDto implements Product {
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    description: string | null;

    @Expose()
    price: number;

    @Expose()
    image: string | null;

    @Expose()
    @Transform(({ value }) => value.toLocaleString())
    createdAt: Date;

    @Expose()
    @Transform(({ value }) => value.toLocaleString())
    updatedAt: Date;

    @Expose()
    @Transform(({ value }) => value.toLocaleString())
    deletedAt: Date | null;
}
