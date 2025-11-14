import { Prisma } from "@prisma/client";
import { IsEmail, IsInt, IsString, IsStrongPassword } from "class-validator";


export class CreateUserDto implements Prisma.UserCreateInput {

    @IsString({
        message: 'El nombre debe ser un texto'
    })
    name: string;
    
    @IsString({
        message: 'El apellido debe ser un texto'
    })
    lastname: string;
    
    @IsEmail({}, {
        message: 'El email debe tener un formato valido'
    })
    email: string;
    
    @IsStrongPassword({
        minLength: 8,

    }, {
        message: 'La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y símbolos especiales'
    })
    password: string;
    
    @IsInt({
        message: 'El roleId debe ser un número entero'
    })
    roleId: number;

}