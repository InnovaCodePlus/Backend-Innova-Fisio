import { $Enums, Prisma } from "@prisma/client";
import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateAppointmentDto implements Omit<Prisma.AppointmentCreateInput, 'user' | 'customer'> {
    @IsString()
    date: string | Date;
    
    @IsString()
    description?: string | null;
    
    @IsOptional()
    @IsEnum($Enums.AppointmentStatus)
    status?: $Enums.AppointmentStatus;

    @IsUUID()
    userId: string;
    
    @IsUUID()
    customerId: string;
}
