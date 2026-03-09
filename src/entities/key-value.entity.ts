import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class KeyValue {
  @PrimaryColumn()
  key!: string;

  @Column('float') // Using float/double for generic numbers
  value!: number;
}
