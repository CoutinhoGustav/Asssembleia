import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('admins')
export class Admin {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    password: string;

    @Column({ type: 'text', nullable: true })
    avatar: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
