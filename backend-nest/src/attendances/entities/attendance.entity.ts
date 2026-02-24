import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('attendances')
export class Attendance {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'student_name' })
    studentName: string;

    @Column()
    status: string; // present, absent

    @CreateDateColumn()
    date: Date;

    @Column({ name: 'recorded_by', nullable: true })
    recordedBy: string;
}
