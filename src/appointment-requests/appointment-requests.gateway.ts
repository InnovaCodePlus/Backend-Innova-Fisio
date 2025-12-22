import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { AppointmentRequestsService } from './appointment-requests.service';
import { CreateAppointmentRequestDto } from './dto/create-appointment-request.dto';
import { Server } from "socket.io";
import { OnModuleInit } from '@nestjs/common';

@WebSocketGateway({ cors: true, namespace: 'appointment-requests' })
export class AppointmentRequestsGateway implements OnModuleInit {
    
    @WebSocketServer()
    private server: Server;
    
    constructor(private readonly appointmentRequestsService: AppointmentRequestsService) { }

    onModuleInit() {
        this.server.on('connection', (socket) => {
            console.log('Client connected:', socket.id);
        })
    }

    @SubscribeMessage('createAppointmentRequest')
    async create(@MessageBody() createAppointmentRequestDto: CreateAppointmentRequestDto) {
        const appointmentRequestCreated = await this.appointmentRequestsService.create(createAppointmentRequestDto);
        this.server.emit('appointmentRequestCreated', appointmentRequestCreated);
    }

    // @SubscribeMessage('changeStatusAppointmentRequest')
    // async changeStatus(@MessageBody() changeStatusAppointmentRequestDto: ChangeStatusAppointmentRequestDto) {
    //     await this.appointmentRequestsService.changeStatus(changeStatusAppointmentRequestDto);
    //     // this.server.emit('appointmentRequestCreated', appointmentRequestCreated);
    //     this.findAll();
    // }

    @SubscribeMessage('findAllAppointmentRequests')
    async findAll() {
        const response = await this.appointmentRequestsService.findAll();
        return this.server.emit('appointmentRequestsList', response);
    }
}
