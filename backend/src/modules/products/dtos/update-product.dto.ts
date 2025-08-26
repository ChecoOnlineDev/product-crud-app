import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
//El uso de partialType es la mejor forma de crear un DTO de actualizacion
//ya que hereda las propiedades de CreateProductDto y las hace opcionales
