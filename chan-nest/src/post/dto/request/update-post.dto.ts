import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePostDto {
  @IsNotEmpty()
  @IsString()
  readonly writerId: string;

  @IsNotEmpty()
  @IsString()
  readonly content: string;
}
