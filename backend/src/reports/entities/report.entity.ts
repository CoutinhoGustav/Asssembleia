import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('reports')
export class Report {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    date: Date;

    @Column('jsonb', { name: 'present_students', nullable: true })
    presentStudents: string[];

    @Column('jsonb', { name: 'absent_students', nullable: true })
    absentStudents: string[];

    @Column({ name: 'total_present' })
    totalPresent: number;

    @Column({ name: 'total_absent' })
    totalAbsent: number;

    @Column({ name: 'recorded_by' })
    recordedBy: string;

    @Column({ name: 'assembly_name', default: 'Chamada Geral' })
    assemblyName: string;
}
