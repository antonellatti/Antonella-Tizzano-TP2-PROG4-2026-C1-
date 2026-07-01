import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'timeago', standalone: true })
export class TimeagoPipe implements PipeTransform {
  transform(value: string | Date): string {
    const now = new Date();
    const date = new Date(value);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'hace unos segundos';
    if (seconds < 3600) return `hace ${Math.floor(seconds / 60)} minutos`;
    if (seconds < 86400) return `hace ${Math.floor(seconds / 3600)} horas`;
    if (seconds < 2592000) return `hace ${Math.floor(seconds / 86400)} días`;
    if (seconds < 31536000) return `hace ${Math.floor(seconds / 2592000)} meses`;
    return `hace ${Math.floor(seconds / 31536000)} años`;
  }
}