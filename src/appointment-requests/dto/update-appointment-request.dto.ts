import { PartialType } from '@nestjs/mapped-types';
import { CreateAppointmentRequestDto } from './create-appointment-request.dto';

export class UpdateAppointmentRequestDto extends PartialType(CreateAppointmentRequestDto) {
  id: number;
}
