import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { StudentsService } from '../students/students.service';
import { SystemStatusService } from '../system-status/system-status.service';
import { AttendancesService } from '../attendances/attendances.service';

@Controller('assembly')
export class AssemblyController {
    constructor(
        private readonly studentsService: StudentsService,
        private readonly systemStatusService: SystemStatusService,
        private readonly attendancesService: AttendancesService,
    ) { }

    @Get('students')
    async findAllStudents() {
        const students = await this.studentsService.findAll();
        return students.map((s: any) => ({ ...s, _id: s.id }));
    }

    @Post('students')
    async createStudent(@Body() dto: any) {
        const student: any = await this.studentsService.create(dto);
        return { ...student, _id: student.id };
    }

    @Delete('students/:id')
    removeStudent(@Param('id') id: string) {
        return this.studentsService.remove(id);
    }

    @Get('status')
    async getStatus() {
        const status: any = await this.systemStatusService.getStatus();
        return { ...status, _id: status.id };
    }

    @Post('status/toggle')
    async toggleStatus() {
        const status = await this.systemStatusService.getStatus();
        return this.systemStatusService.toggleCall(!status.isCallActive);
    }

    @Post('attendance')
    async createAttendance(@Body('records') records: any[]) {
        const results = [];
        for (const record of records) {
            const saved: any = await this.attendancesService.create(record);
            results.push({ ...saved, _id: saved.id });
        }
        return { savedRecords: results };
    }

    @Get('history')
    async getHistory(@Query('date') date?: string) {
        const attendances = await this.attendancesService.findAll();
        return attendances.map((a: any) => ({ ...a, _id: a.id }));
    }

    @Put('attendance/:id')
    async updateAttendance(@Param('id') id: string, @Body() dto: any) {
        const updated: any = await this.attendancesService.update(id, dto);
        return { ...updated, _id: updated.id };
    }

    @Delete('attendance/:id')
    async removeAttendance(@Param('id') id: string) {
        return this.attendancesService.remove(id);
    }
}
