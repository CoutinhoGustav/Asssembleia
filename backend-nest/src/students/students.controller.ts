import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { StudentsService } from './students.service';

@Controller('students')
export class StudentsController {
    constructor(private readonly studentsService: StudentsService) { }

    @Post()
    create(@Body() createDto: any) {
        return this.studentsService.create(createDto);
    }

    @Get()
    findAll() {
        return this.studentsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.studentsService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateDto: any) {
        return this.studentsService.update(id, updateDto);
    }

    @Patch(':id')
    partialUpdate(@Param('id') id: string, @Body() updateDto: any) {
        return this.studentsService.update(id, updateDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.studentsService.remove(id);
    }
}
