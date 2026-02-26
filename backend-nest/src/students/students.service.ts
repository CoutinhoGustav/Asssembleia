import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentsService {
    constructor(
        @InjectRepository(Student)
        private readonly repository: Repository<Student>,
    ) { }

    async create(createDto: any) {
        const name = createDto.name?.trim();
        if (!name) {
            throw new BadRequestException('O nome é obrigatório');
        }

        const existing = await this.repository.findOne({
            where: { name: ILike(name) }
        });

        if (existing) {
            throw new ConflictException('Já existe um membro registrado com este nome.');
        }

        const student = this.repository.create({ ...createDto, name });
        return this.repository.save(student);
    }

    findAll() {
        return this.repository.find({
            order: { name: 'ASC' }
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
