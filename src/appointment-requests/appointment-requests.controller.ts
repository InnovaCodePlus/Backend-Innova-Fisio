import { Body, Controller, Param, Patch, Post } from "@nestjs/common";
import { AppointmentRequestsService } from "./appointment-requests.service";
import { ChangeStatusAppointmentRequestDto } from "./dto/change-status-appointment-request.dto";
import { AppointmentRequestsGateway } from "./appointment-requests.gateway";

@Controller('appointment-requests')
export class AppointmentRequestsController {
    constructor(
        private readonly appointmentRequestsService: AppointmentRequestsService,
        private readonly appointmentRequestsGateway: AppointmentRequestsGateway,
    ) { }

    @Patch('change-status/:id')
    async changeStatus(
        @Param('id') id: string,
        @Body() ChangeStatusAppointmentRequestDto: ChangeStatusAppointmentRequestDto
    ) {
        const response = await this.appointmentRequestsService.changeStatus(id, ChangeStatusAppointmentRequestDto);
        this.appointmentRequestsGateway.findAll();
        return response;
    }
}
