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

    async create(createDto: any) {
        // Check for existing student with same name (case-insensitive)
        const existing = await this.repository.findOne({
            where: { name: createDto.name }
        });

        if (existing) {
            throw new Error('Membro já cadastrado com este nome');
        }

        const student = this.repository.create(createDto);
        return this.repository.save(student);
    }

    findAll() {
        return this.repository.find({
            order: {
                name: 'ASC'
            }
        });
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
