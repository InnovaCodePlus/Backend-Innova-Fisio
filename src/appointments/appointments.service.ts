import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RequestFiltersDto } from '../common/dto/request-filters.dto';
import { CustomersService } from 'src/customers/customers.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AppointmentsService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly usersService: UsersService,
        private readonly customersService: CustomersService,
    ) { }

    async create(createAppointmentDto: CreateAppointmentDto) {
        
        await this.usersService.findOne(createAppointmentDto.userId);
        await this.customersService.findOne(createAppointmentDto.customerId);

        
        try {
            const appointment = await this.prisma.appointment.create({
                data: {
                    ...createAppointmentDto,
                    date: new Date(createAppointmentDto.date),
                }
            })

            return {
                message: 'Cita registrada exitosamente',
                appointment,
            };

        } catch (error) {
            console.log(
                JSON.stringify(error, null, 2)
            );
            throw new InternalServerErrorException('Ocurrio un error - Revise los logs del servidor');
        }
    }

    async findAll(requestFiltersDto: RequestFiltersDto) {
        const { limit = 10, search, page = 1 } = requestFiltersDto;

        const filters: any[] = [];

        if (search) {
            filters.push({
                OR: [
                    { date: { contains: search, mode: 'insensitive' } },
                ]
            })
        }

        const whereClause = filters.length > 0 ? { AND: filters } : {};

        const [totalAppointments, appointments] = await Promise.all([
            this.prisma.appointment.count({
                where: whereClause,
            }),
            this.prisma.appointment.findMany({
                take: limit,
                skip: (page! - 1) * limit!,
                orderBy: {
                    createdAt: 'desc',
                },
                where: whereClause,
            })
        ]);

        const lastPage = Math.ceil(totalAppointments / limit);

        return {
            appointments,
            meta: {
                page,
                limit,
                lastPage,
                totalItems: totalAppointments,
            }
        };
    }

    async findOne(id: number) {
        return `This action returns a #${id} appointment`;
    }

    async update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
        return `This action updates a #${id} appointment`;
    }
}
