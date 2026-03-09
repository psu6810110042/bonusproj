import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KeyValue } from './entities/key-value.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(KeyValue)
    private kvRepo: Repository<KeyValue>,
  ) {}

  async getValue(key: string): Promise<number> {
    const record = await this.kvRepo.findOne({ where: { key } });
    if (!record) throw new NotFoundException(`Key '${key}' not found`);
    return record.value;
  }

  async writeValue(key: string, value: number): Promise<KeyValue> {
    // Upsert: Create if not exists, Update if exists
    const record = await this.kvRepo.preload({ key, value });
    if (!record) {
      // If it doesn't exist, create new instance
      return this.kvRepo.save(this.kvRepo.create({ key, value }));
    }
    return this.kvRepo.save(record);
  }
}
