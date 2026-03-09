import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ApiKey {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  key!: string; // The actual string sent in the header

  @Column({ default: false })
  canRead!: boolean; // Permission to read

  @Column({ default: false })
  canWrite!: boolean; // Permission to write
}
