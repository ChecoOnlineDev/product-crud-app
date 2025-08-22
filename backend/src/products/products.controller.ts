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
    UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dtos/update-product.dto';
import { CreateProductDto } from './dtos/create-product.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { ProductIdParamDto } from './dtos/product-id-param';
import { JwtPayload } from 'src/common/classes/jwt-payload.class';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

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
    getProducts(@CurrentUser() user: JwtPayload) {
        return this.productsService.getAllProducts(user.userId);
    }

    @Get('product/:productId')
    @ApiOperation({ summary: 'Return product by id' })
    getProductById(
        @Param() { productId }: ProductIdParamDto,
        @CurrentUser() user: JwtPayload,
    ) {
        return this.productsService.getProductById(user.userId, productId);
    }

    @Post('create-product')
    @ApiOperation({ summary: 'Create a new product' })
    createProduct(
        @Body() createProductData: CreateProductDto,
        @CurrentUser() user: JwtPayload,
    ) {
        return this.productsService.createProduct(
            createProductData,
            user.userId,
        );
    }

    @Patch('update-product/:productId')
    @ApiOperation({ summary: 'Update an existing product' })
    updateProduct(
        @Param() { productId }: ProductIdParamDto,
        @Body() updateProductData: UpdateProductDto,
        @CurrentUser() user: JwtPayload,
    ) {
        return this.productsService.updateProduct(productId, updateProductData);
    }

    @Delete('delete-product/:productId')
    @ApiOperation({ summary: 'Delete a product by id' })
    deleteProduct(
        @Param() { productId }: ProductIdParamDto,
        @CurrentUser() user: JwtPayload,
    ) {
        return this.productsService.deleteProduct(productId);
    }

    @Delete('delete-all-products')
    @ApiOperation({ summary: 'Delete all products' })
    deleteAllProducts(@CurrentUser() user: JwtPayload) {
        return this.productsService.deleteAllProducts();
    }

    @Delete('reset-all-products')
    @ApiOperation({ summary: 'CAUTION' })
    resetAllProducts(@CurrentUser() user: JwtPayload) {
        this.productsService.resetAllProducts();
    }
}
