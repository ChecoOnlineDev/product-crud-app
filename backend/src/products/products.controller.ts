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
    UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dtos/update-product.dto';
import { CreateProductDto } from './dtos/create-product.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';

//localhost:4000/api/products/
@ApiTags('products')
@Controller('products')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Get('all-products')
    @ApiOperation({ summary: 'return all products' })
    @ApiResponse({
        status: 200,
        description: 'Return all products',
    })
    getProducts() {
        return this.productsService.getAllProducts();
    }

    @Get('product/:id')
    @ApiOperation({ summary: 'Return product by id' })
    getProductById(@Param('id', ParseIntPipe) productId: number) {
        return this.productsService.getProductById(productId);
    }

    @Post('create-product')
    @ApiOperation({ summary: 'Create a new product' })
    createProduct(@Body() createProductData: CreateProductDto) {
        return this.productsService.createProduct(createProductData);
    }

    @Patch('update-product/:id')
    @ApiOperation({ summary: 'Update an existing product' })
    updateProduct(
        @Param('id', ParseIntPipe) productId: number,
        @Body() updateProductData: UpdateProductDto,
    ) {
        return this.productsService.updateProduct(productId, updateProductData);
    }

    @Delete('delete-product/:id')
    @ApiOperation({ summary: 'Delete a product by id' })
    deleteProduct(@Param('id', ParseIntPipe) productId: number) {
        return this.productsService.deleteProduct(productId);
    }

    @Delete('delete-all-products')
    @ApiOperation({ summary: 'Delete all products' })
    deleteAllProducts() {
        return this.productsService.deleteAllProducts();
    }

    @Delete('reset-all-products')
    @ApiOperation({ summary: 'CAUTION' })
    resetAllProducts() {
        this.productsService.resetAllProducts();
    }
}
