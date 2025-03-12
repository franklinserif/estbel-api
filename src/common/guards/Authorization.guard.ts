import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '@auth/decorators/public';
import {
  MODULE_PERMISSION_KEY,
  PermissionType,
} from '@common/decorators/auth-permission.decorator';
import { AuthService } from '@auth/auth.service';

@Injectable()
export class Authorization implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const accessToken = this.extractTokenFromHeader(request);
    const refreshToken = request.cookies?.refreshToken as string | undefined;

    try {
      const admin = await this.authService.verifyTokens(
        accessToken,
        refreshToken,
      );

      request['user'] = admin;

      const moduleMetadata = this.reflector.get<{
        moduleId: string;
        permission: PermissionType;
      }>(MODULE_PERMISSION_KEY, context.getHandler());

      if (moduleMetadata) {
        const { moduleId, permission } = moduleMetadata;
        const access = admin.accesses.find(
          (acc) => acc.moduleName === moduleId,
        );

        if (!access) {
          throw new UnauthorizedException(
            'Access denied: No access record for this module',
          );
        }

        if (permission === 'read' && !access.canRead) {
          throw new UnauthorizedException(
            'Access denied: Missing read permission',
          );
        }

        if (permission === 'create' && !access.canCreate) {
          throw new UnauthorizedException(
            'Access denied: Missing create permission',
          );
        }
        if (permission === 'edit' && !access.canEdit) {
          throw new UnauthorizedException(
            'Access denied: Missing edit permission',
          );
        }
        if (permission === 'delete' && !access.canDelete) {
          throw new UnauthorizedException(
            'Access denied: Missing delete permission',
          );
        }
        if (permission === 'print' && !access.canPrint) {
          throw new UnauthorizedException(
            'Access denied: Missing print permission',
          );
        }
      }
    } catch (error) {
      throw new UnauthorizedException(`Token is not valid: ${error.message}`);
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
