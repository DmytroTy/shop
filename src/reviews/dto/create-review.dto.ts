import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(5)
  readonly rating: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly comment: string;

  @ApiProperty()
  readonly product: { id: number };
}
