import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentsService {
    constructor(
        @InjectRepository(Student)
        private readonly repository: Repository<Student>,
    ) { }

    create(createDto: any) {
        const student = this.repository.create(createDto);
        return this.repository.save(student);
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
        const student = await this.findOne(id);
        if (student) {
            return this.repository.remove(student);
        }
    }
}
