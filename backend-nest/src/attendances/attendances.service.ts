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

    async removeByDate(dateStr: string) {
        // As datas estão salvas como Date, o formato da query string vem como YYYY-MM-DD
        // Então deletamos tudo onde o início coincide com essa data (ignorando a hora)
        // Por segurança, vamos buscar todos e deletar os que baterem a data na string
        const all = await this.findAll();
        const toDelete = all.filter(a => {
            if (!a.date) return false;
            const itemDate = a.date.toISOString().split('T')[0];
            return itemDate === dateStr;
        });

        if (toDelete.length > 0) {
            return this.repository.remove(toDelete);
        }
        return { deleted: 0 };
    }
}
