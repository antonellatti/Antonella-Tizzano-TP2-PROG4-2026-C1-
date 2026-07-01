import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../auth/roles.guard';
import { StatsService } from './stats.service';

@Controller('stats')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class StatsController {
  constructor(private statsService: StatsService) {}

  @Get('posts-por-usuario')
  postsPorUsuario(@Query('desde') desde?: string, @Query('hasta') hasta?: string) {
    return this.statsService.postsPorUsuario(desde, hasta);
  }

  @Get('comentarios-por-fecha')
  comentariosPorFecha(@Query('desde') desde?: string, @Query('hasta') hasta?: string) {
    return this.statsService.comentariosPorFecha(desde, hasta);
  }

  @Get('comentarios-por-post')
  comentariosPorPost(@Query('desde') desde?: string, @Query('hasta') hasta?: string) {
    return this.statsService.comentariosPorPost(desde, hasta);
  }
}