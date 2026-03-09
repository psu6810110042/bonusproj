import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKey } from './entities/api-key.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(ApiKey)
    private readonly apiKeyRepo: Repository<ApiKey>,
  ) {}

  async onModuleInit() {
    const count = await this.apiKeyRepo.count();

    if (count === 0) {
      console.log('🌱 Database is empty. Seeding initial API Keys...');

      const keys = [
        { key: 'admin-secret', canRead: true, canWrite: true }, // Full Access
        { key: 'reader-only', canRead: true, canWrite: false }, // Read Only
        { key: 'writer-only', canRead: false, canWrite: true }, // Write Only
      ];

      await this.apiKeyRepo.save(keys);
      console.log('Seeding complete!');
    }
  }
}
