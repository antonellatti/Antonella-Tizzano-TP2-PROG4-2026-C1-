import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    if (req.user?.rol !== 'administrador') {
      throw new ForbiddenException('Solo administradores pueden acceder a este recurso');
    }
    return true;
  }
}