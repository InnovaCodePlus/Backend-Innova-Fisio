import { Module } from '@nestjs/common';
import { AppointmentRequestsService } from './appointment-requests.service';
import { AppointmentRequestsGateway } from './appointment-requests.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CustomersModule } from 'src/customers/customers.module';
import { AppointmentRequestsController } from './appointment-requests.controller';

@Module({
    providers: [AppointmentRequestsGateway, AppointmentRequestsService],
    imports: [PrismaModule, CustomersModule],
    controllers: [AppointmentRequestsController],
})
export class AppointmentRequestsModule { }
