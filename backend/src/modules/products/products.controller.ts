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
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard';
import { ProductIdParamDto } from './dtos/product-id-param';
import { JwtPayload } from 'src/common/classes/jwt-payload.class';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'generated/prisma';

//localhost:4000/api/products/
@ApiTags('products')
@Controller('products')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Get('all-products')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'return all products' })
    @ApiResponse({
        status: 200,
        description: 'Return all products',
    })
    getProducts(@CurrentUser() user: JwtPayload) {
        return this.productsService.getAllProducts(user.userId);
    }

    @Get('product/:productId')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Return product by id' })
    getProductById(
        @Param() { productId }: ProductIdParamDto,
        @CurrentUser() user: JwtPayload,
    ) {
        return this.productsService.getProductById(user.userId, productId);
    }

    @Post('create-product')
    @UseGuards(JwtAuthGuard)
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
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Update an existing product' })
    updateProduct(
        @Param() { productId }: ProductIdParamDto,
        @Body() updateProductData: UpdateProductDto,
        @CurrentUser() user: JwtPayload,
    ) {
        return this.productsService.updateProduct(
            productId,
            updateProductData,
            user.userId,
        );
    }

    @Delete('delete-product/:productId')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Delete a product by id' })
    deleteProduct(
        @Param() { productId }: ProductIdParamDto,
        @CurrentUser() user: JwtPayload,
    ) {
        return this.productsService.deleteProduct(productId, user.userId);
    }

    @Delete('delete-all-products')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Delete all products' })
    deleteAllProducts(@CurrentUser() user: JwtPayload) {
        return this.productsService.deleteAllProducts(user.userId);
    }

    @Delete('reset-all-products')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN) //requiere un rol de administrador para hacer una peticion a este endpoint
    @ApiOperation({ summary: 'CAUTION' })
    resetAllProducts(@CurrentUser() user: JwtPayload) {
        this.productsService.resetAllProducts();
    }
}
