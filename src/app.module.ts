import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { CustomersModule } from './customers/customers.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { AppointmentRequestsModule } from './appointment-requests/appointment-requests.module';

@Module({
    imports: [UsersModule, PrismaModule, CustomersModule, AppointmentsModule, AppointmentRequestsModule],
    controllers: [],
    providers: [],
})
export class AppModule { }
