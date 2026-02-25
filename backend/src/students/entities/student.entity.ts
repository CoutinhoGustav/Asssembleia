import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('students')
export class Student {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ default: 'active' })
    status: string; // active, inactive

    @Column({ name: 'registered_by', nullable: true })
    registeredBy: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
