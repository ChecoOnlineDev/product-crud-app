import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class ProductIdParamDto {
    @Type(() => Number)
    @IsInt()
    productId: number;
}
