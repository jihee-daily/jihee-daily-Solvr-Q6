import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Sleep {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    sleepTime: Date;

    @Column()
    wakeTime: Date;

    @Column()
    duration: number;

    @Column({ nullable: true })
    quality: number;

    @Column({ nullable: true })
    notes: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
} 