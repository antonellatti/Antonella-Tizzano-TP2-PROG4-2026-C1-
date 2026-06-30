import { IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString() mensaje!: string;
}

export class UpdateCommentDto {
  @IsString() mensaje!: string;
}