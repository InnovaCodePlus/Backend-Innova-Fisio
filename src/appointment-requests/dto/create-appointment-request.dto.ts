import { Prisma } from "@prisma/client";
import { IsEmail, IsOptional, IsString } from "class-validator";

export class CreateAppointmentRequestDto implements Prisma.AppointmentRequestCreateWithoutCustomerInput {
    
    @IsString()
    name: string;

    @IsString()
    lastname: string;
    
    @IsEmail()
    email: string;

    @IsString()
    phone: string;

    @IsOptional()
    @IsString()
    address?: string | null | undefined;

    @IsOptional()
    @IsString()
    birthDate?: string | Date | null | undefined;

    @IsString()
    description?: string;
}
