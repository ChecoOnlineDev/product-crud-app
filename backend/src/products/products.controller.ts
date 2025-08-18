import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseInterceptors,
    ParseIntPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dtos/update-product.dto';
import { CreateProductDto } from './dtos/create-product.dto';

//localhost:4000/api/products/
@Controller('products')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Get('all-products')
    getProducts() {
        return this.productsService.getAllProducts();
    }

    @Get('product/:id')
    getProductById(@Param('id', ParseIntPipe) productId: number) {
        return this.productsService.getProductById(productId);
    }

    @Post('create-product')
    createProduct(@Body() createProductData: CreateProductDto) {
        return this.productsService.createProduct(createProductData);
    }

    @Patch('update-product/:id')
    updateProduct(
        @Param('id', ParseIntPipe) productId: number,
        @Body() updateProductData: UpdateProductDto,
    ) {
        return this.productsService.updateProduct(productId, updateProductData);
    }

    @Delete('delete-product/:id')
    deleteProduct(@Param('id', ParseIntPipe) productId: number) {
        return this.productsService.deleteProduct(productId);
    }

    @Delete('delete-all-products')
    deleteAllProducts() {
        return this.productsService.deleteAllProducts();
    }

    @Delete('reset-all-products')
    resetAllProducts() {
        this.productsService.resetAllProducts();
    }
}
