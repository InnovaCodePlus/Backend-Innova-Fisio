import { Injectable } from '@nestjs/common';
import { CreateAppointmentRequestDto } from './dto/create-appointment-request.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomersService } from 'src/customers/customers.service';
import { ChangeStatusAppointmentRequestDto } from './dto/change-status-appointment-request.dto';

@Injectable()
export class AppointmentRequestsService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly customerService: CustomersService,
    ) { }

    async create(createAppointmentRequestDto: CreateAppointmentRequestDto) {

        const { description, ...customer } = createAppointmentRequestDto;

        const customerExists = await this.prisma.customer.findUnique({
            where: {
                email: createAppointmentRequestDto.email,
            }
        });

        if (customerExists) {
            const appointmentRequest = await this.prisma.appointmentRequest.create({
                data: {
                    customerId: customerExists.id,
                    description: createAppointmentRequestDto.description,
                },
                include: {
                    customer: true,
                },
                omit: {
                    customerId: true,
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
            },
            include: {
                customer: true,
            },
            omit: {
                customerId: true,
            }
        })

        // TODO?: notificaar al whatsapp que se registro su cita
        return {
            appointmentRequest,
        }

    }

    async findAll() {
        const appointmentRequests = await this.prisma.appointmentRequest.findMany({
            include: {
                customer: true,
            },
            omit: {
                customerId: true,
            },
        });

        return {
            appointmentRequests
        }
    }

    async changeStatus(id: string, changeStatusAppointmentRequestDto: ChangeStatusAppointmentRequestDto) {
        const { status } = changeStatusAppointmentRequestDto;

        if( status === 'Aprobado' ){

            const request = await this.prisma.appointmentRequest.findUnique({
                where: {
                    id,
                },
                include: {
                    customer: true,
                },
                omit: {
                    customerId: true,
                },
            });

            await this.prisma.appointment.create({
                data: {
                    customerId: request!.customer.id,
                    status: 'Pendiente',
                    date: new Date(), // TODO: cambiar por la fecha que el admin asigne
                    description: `Cita creada a partir de la solicitud: ${request!.description}`,
                    userId: "55c74ee6-49ba-4ccd-a31d-21f6b004a827", // TODO: cambiar por el id del usuario que este logueado
                }
            })
        }

        await this.prisma.appointmentRequest.update({
            where: {
                id,
            },
            data: {
                status,
            },
            include: {
                customer: true,
            },
            omit: {
                customerId: true,
            },
        });

        return {
            message: 'Estado de la solicitud de cita actualizado correctamente',
        }
    }
}
