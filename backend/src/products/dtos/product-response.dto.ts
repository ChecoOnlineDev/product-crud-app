import { Expose, Transform } from 'class-transformer';
import { Product } from 'generated/prisma';

export class ProductResponseDto implements Product {
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
}
