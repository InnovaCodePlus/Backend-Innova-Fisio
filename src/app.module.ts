import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { CustomersModule } from './customers/customers.module';
import { AppointmentsModule } from './appointments/appointments.module';

@Module({
    imports: [UsersModule, PrismaModule, CustomersModule, AppointmentsModule],
    controllers: [],
    providers: [],
})
export class AppModule { }
