import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Admin)
        private readonly repository: Repository<Admin>,
    ) { }

    async create(createDto: any) {
        const hashedPassword = await bcrypt.hash(createDto.password, 10);
        const admin = this.repository.create({
            ...createDto,
            password: hashedPassword,
        });
        return this.repository.save(admin);
    }

    findAll() {
        return this.repository.find();
    }

    findByEmail(email: string) {
        return this.repository.findOne({
            where: { email },
            select: ['id', 'name', 'email', 'password', 'avatar'] // Include password for login
        });
    }

    async update(id: string, updateDto: any) {
        if (updateDto.password) {
            updateDto.password = await bcrypt.hash(updateDto.password, 10);
        }
        await this.repository.update(id, updateDto);
        return this.repository.findOne({ where: { id } });
    }

    async remove(id: string) {
        return this.repository.delete(id);
    }
}
