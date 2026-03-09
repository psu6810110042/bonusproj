import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KeyValue } from './entities/key-value.entity';
import { ApiKey } from './entities/api-key.entity';
import { ApiKeyGuard } from './api-key.guard';
import { SeedService } from './seed.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [KeyValue, ApiKey],
      synchronize: true, // Only for development!
    }),
    TypeOrmModule.forFeature([KeyValue, ApiKey]),
  ],
  controllers: [AppController],
  providers: [AppService, SeedService, ApiKeyGuard],
})
export class AppModule {}
