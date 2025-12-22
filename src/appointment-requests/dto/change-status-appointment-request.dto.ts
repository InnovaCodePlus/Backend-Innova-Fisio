import { IsEnum } from "class-validator";
import { $Enums } from '@prisma/client';


export class ChangeStatusAppointmentRequestDto {
    @IsEnum($Enums.AppointmentRequestStatus)
    status: $Enums.AppointmentRequestStatus;
}