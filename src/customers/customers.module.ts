import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    controllers: [CustomersController],
    providers: [CustomersService],
    imports: [PrismaModule, AuthModule],
    exports: [CustomersService],
})
export class CustomersModule { }
