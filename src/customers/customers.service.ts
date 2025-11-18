import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RequestFiltersDto } from 'src/common/dto/request-filters.dto';

@Injectable()
export class CustomersService {

    constructor(
        private readonly prisma: PrismaService
    ) { }

    async create(createCustomerDto: CreateCustomerDto) {
        try {
            const customer = await this.prisma.customer.create({
                data: createCustomerDto
            })

            return {
                message: 'Cliente registrado exitosamente',
                customer,
            };

        } catch (error) {
            if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
                throw new BadRequestException('El email del cliente ya está en uso');
            }

            throw new InternalServerErrorException('Ocurrio un error - Revise los logs del servidor');
        }
    }

    async findAll(requestFiltersDto: RequestFiltersDto) {
        const { limit = 10, search, page = 1 } = requestFiltersDto;

        const filters: any[] = [];

        if (search) {
            filters.push({
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                    { phone: { contains: search, mode: 'insensitive' } },
                    { lastname: { contains: search, mode: 'insensitive' } },
                ]
            })
        }

        const whereClause = filters.length > 0 ? { AND: filters } : {};


        const [totalCustomers, customers] = await Promise.all([
            this.prisma.customer.count({
                where: whereClause,
            }),
            this.prisma.customer.findMany({
                take: limit,
                skip: (page! - 1) * limit!,
                orderBy: {
                    createdAt: 'desc',
                },
                where: whereClause,
            })
        ]);

        const lastPage = Math.ceil(totalCustomers / limit);

        return {
            customers,
            meta: {
                page,
                limit,
                lastPage,
                totalItems: totalCustomers,
            }
        };
    }

    async findOne(id: string) {

        const customerExist = await this.prisma.customer.findUnique({
            where: { id }
        })

        if (!customerExist) {
            throw new NotFoundException('Cliente no encontrado');
        }

        return {
            customer: customerExist
        };
    }

    async update(id: string, updateCustomerDto: UpdateCustomerDto) {

        await this.findOne(id);

        const customer = await this.prisma.customer.update({
            where: { id },
            data: updateCustomerDto,
        })

        return {
            message: 'La información del cliente fue actualizada',
            customer,
        };
    }

    async remove(id: string) {
        await this.prisma.customer.delete({
            where: { id }
        })

        return {
            message: 'Cliente eliminado'
        };
    }
}
