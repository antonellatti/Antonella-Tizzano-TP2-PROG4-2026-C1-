import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'likesCount', standalone: true })
export class LikesCountPipe implements PipeTransform {
  transform(value: number): string {
    if (!value || value === 0) return '0';
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  }
}