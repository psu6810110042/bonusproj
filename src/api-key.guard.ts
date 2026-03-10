import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKey } from './entities/api-key.entity';
import { PERMISSIONS_KEY, PermissionType } from './permissions.decorator';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(ApiKey)
    private apiKeyRepo: Repository<ApiKey>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // get perms for route (read or write)
    const requiredPermission = this.reflector.getAllAndOverride<PermissionType>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const apiKeyHeader = request.headers['x-api-key']; // Standard naming convention

    if (!apiKeyHeader) {
      throw new UnauthorizedException('API Key is missing');
    }

    // fetch api key from database
    const apiKeyEntity = await this.apiKeyRepo.findOne({
      where: { key: apiKeyHeader },
    });

    if (!apiKeyEntity) {
      throw new UnauthorizedException('Invalid API Key');
    }

    // Check Permissions
    if (requiredPermission === 'read' && !apiKeyEntity.canRead) {
      throw new ForbiddenException(
        'This API Key does not have Read permissions',
      );
    }

    if (requiredPermission === 'write' && !apiKeyEntity.canWrite) {
      throw new ForbiddenException(
        'This API Key does not have Write permissions',
      );
    }

    return true;
  }
}
