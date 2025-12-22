import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RequestFiltersDto } from 'src/common/dto/request-filters.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

// @UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    findAll(
        @Query() requestFiltersDto: RequestFiltersDto
    ) {
        return this.usersService.findAll(requestFiltersDto);
    }

    @Post()
    create(
        @Body() createUserDto: CreateUserDto
    ){
        return this.usersService.create(createUserDto);
    }

    @Get(':id')
    findOne(
        @Param('id') id: string
    ){
        return this.usersService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto
    ){
        return this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    remove(
        @Param('id') id: string
    ){
        return this.usersService.remove(id);
    }
}
