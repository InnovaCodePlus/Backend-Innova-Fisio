import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CustomersModule } from 'src/customers/customers.module';
import { UsersModule } from 'src/users/users.module';

@Module({
    controllers: [AppointmentsController],
    providers: [AppointmentsService],
    imports: [PrismaModule, CustomersModule, UsersModule]
})
export class AppointmentsModule { }
