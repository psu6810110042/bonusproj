import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiKeyGuard } from './api-key.guard';
import { RequirePermission } from './permissions.decorator';

@Controller('kv')
@UseGuards(ApiKeyGuard) // Apply Guard to all routes in this controller
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Endpoint 1: Read Key
  @Get(':key')
  @RequirePermission('read')
  async getKey(@Param('key') key: string) {
    const value = await this.appService.getValue(key);
    return { key, value };
  }

  // Endpoint 2: Write Key
  @Post()
  @RequirePermission('write')
  async writeKey(@Body() body: { key: string; value: number }) {
    return this.appService.writeValue(body.key, body.value);
  }
}
