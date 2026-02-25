import { Controller, Get, Post, Body } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
    constructor(private readonly service: ReportsService) { }

    @Post()
    create(@Body() dto: any) {
        return this.service.create(dto);
    }

    @Get()
    findAll() {
        return this.service.findAll();
    }
}
