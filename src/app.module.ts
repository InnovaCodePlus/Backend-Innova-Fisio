import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { CustomersModule } from './customers/customers.module';

@Module({
    imports: [UsersModule, PrismaModule, CustomersModule],
    controllers: [],
    providers: [],
})
export class AppModule { }
