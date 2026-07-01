import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'pluralize', standalone: true })
export class PluralizePipe implements PipeTransform {
  transform(value: number, singular: string, plural: string): string {
    return value === 1 ? `${value} ${singular}` : `${value} ${plural}`;
  }
}