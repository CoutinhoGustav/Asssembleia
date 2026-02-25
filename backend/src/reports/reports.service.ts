import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(Report)
        private readonly repository: Repository<Report>,
    ) { }

    create(createDto: any) {
        const report = this.repository.create(createDto);
        return this.repository.save(report);
    }

    findAll() {
        return this.repository.find();
    }
}
