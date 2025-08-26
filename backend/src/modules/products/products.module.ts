import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
    controllers: [ProductsController],
    providers: [ProductsService],
    imports: [PrismaModule, AuthModule],
    exports: [ProductsService],
})
export class ProductsModule {}
