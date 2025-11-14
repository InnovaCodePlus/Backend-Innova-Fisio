import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RequestFiltersDto } from 'src/common/dto/request-filters.dto';

@Injectable()
export class UsersService {

    constructor(
        private readonly prisma: PrismaService
    ) { }

    async findAll(requestFiltersDto: RequestFiltersDto) {

        const { limit = 10, search, page = 1 } = requestFiltersDto;

        const filters: any[] = [];

        if (search) {
            filters.push({
                OR: [
                    { email: { contains: search, mode: 'insensitive' } },
                    { name: { contains: search, mode: 'insensitive' } },
                    { lastname: { contains: search, mode: 'insensitive' } },
                ]
            })
        }

        const whereClause = filters.length > 0 ? { AND: filters } : {};


        const [totalUsers, users] = await Promise.all([
            this.prisma.user.count({
                where: whereClause,
            }),
            this.prisma.user.findMany({
                take: limit,
                skip: (page! - 1) * limit!,
                orderBy: {
                    createdAt: 'desc',
                },
                omit: {
                    password: true,
                },
                where: whereClause,
            })
        ]);

        const lastPage = Math.ceil(totalUsers / limit);

        return {
            users,
            meta: {
                page,
                limit,
                lastPage,
                totalItems: totalUsers,
            }
        };
    }


    async create(createUserDto: CreateUserDto) {

        // const clientExists = await this.prisma.user.findFirst({
        //     where: {
        //         email: createUserDto.email
        //     }
        // });

        // if(clientExists){
        //     throw new BadRequestException('El email ya está en uso');
        // }

        try {
            const user = await this.prisma.user.create({
                data: createUserDto
            })

            return {
                message: 'Usuario creado',
                user,
            };

        } catch (error) {
            if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
                throw new BadRequestException('El email ya está en uso');
            }

            throw new InternalServerErrorException('Ocurrio un error - Revise los logs del servidor');
        }
    }


    async update(id: string, updateUserDto: UpdateUserDto) {

        const user = await this.prisma.user.update({
            where: { id },
            data: updateUserDto,
        })

        return {
            message: 'Usuario actualizado',
            user,
        };
    }

    async remove(id: string) {

        await this.prisma.user.delete({
            where: { id }
        })

        return {
            message: 'Usuario eliminado'
        };
    }
}
