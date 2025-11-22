import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) { }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        const userExists = await this.prisma.user.findUnique({
            where: { email },
            include: { role: true },
        });

        if (!userExists) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const isPasswordValid = bcrypt.compareSync(password, userExists.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const payload: JwtPayload = {
            id: userExists.id,
            name: userExists.name,
            lastname: userExists.lastname,
            email: userExists.email,
            role: userExists.role?.name,
        }

        const token = this.jwtService.sign(payload);

        await this.prisma.user.update({
            where: { id: userExists.id },
            data: {
                token,
            }
        })

        return {
            message: 'Inicio de sesión exitoso',
            user: {
                id: userExists.id,
                name: userExists.name,
                lastname: userExists.lastname,
                email: userExists.email,
                role: userExists.role?.name,
            },
            token,
        };
    }

    async logout(token: string) {
        const { user } = await this.verifyToken(token);

        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                token: null,
            }
        })

        return { message: 'Cierre de sesión exitoso' };

    }


    async verifyToken(token: string) {
        try {
            const payload = this.jwtService.verify<JwtPayload>(token, {
                secret: process.env.JWT_SECRET,
            });
            
            if( !payload.id ) throw new UnauthorizedException('Token inválido');

            const user = await this.prisma.user.findUnique({
                where: { id: payload.id },
                include: { role: true },
                omit: {
                    password: true,
                }
            });

            if( !user ) throw new UnauthorizedException('Token inválido');

            if( user.token !== token ) {
                throw new UnauthorizedException('Token inválido');
            }

            return {
                user,
                token  
            };

        } catch (error) {
            throw new UnauthorizedException('Token inválido');
        }
    }
}
