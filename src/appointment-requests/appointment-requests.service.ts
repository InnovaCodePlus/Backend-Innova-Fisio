import { Injectable } from '@nestjs/common';
import { CreateAppointmentRequestDto } from './dto/create-appointment-request.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomersService } from 'src/customers/customers.service';

@Injectable()
export class AppointmentRequestsService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly customerService: CustomersService,
    ) {}

    async create(createAppointmentRequestDto: CreateAppointmentRequestDto) {

        const { description, ...customer } = createAppointmentRequestDto;

        const customerExists = await this.prisma.customer.findUnique({
            where: {
                email: createAppointmentRequestDto.email,
            }
        });

        if(customerExists){
            const appointmentRequest = await this.prisma.appointmentRequest.create({
                data: {
                    customerId: customerExists.id,
                    description: createAppointmentRequestDto.description,
                }
            })
                // TODO?: notificaar al whatsapp que se registro su cita
            return {
                appointmentRequest
            }
        }

        const { customer: customerResponse } = await this.customerService.create(customer);

        const appointmentRequest = await this.prisma.appointmentRequest.create({
            data: {
                customerId: customerResponse.id,
                description: createAppointmentRequestDto.description,
            }
        })

        // TODO?: notificaar al whatsapp que se registro su cita
        return {
            appointmentRequest,
        }

    }

    async findAll() {

    }
}
