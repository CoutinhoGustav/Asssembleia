import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';

@Injectable()
export class AttendancesService {
    constructor(
        @InjectRepository(Attendance)
        private readonly repository: Repository<Attendance>,
    ) { }

    create(createDto: any) {
        const attendance = this.repository.create(createDto);
        return this.repository.save(attendance);
    }

    findAll() {
        return this.repository.find();
    }

    findOne(id: string) {
        return this.repository.findOne({ where: { id } });
    }

    async update(id: string, updateDto: any) {
        await this.repository.update(id, updateDto);
        return this.findOne(id);
    }

    async remove(id: string) {
        const attendance = await this.findOne(id);
        if (attendance) {
            return this.repository.remove(attendance);
        }
    }
}
