import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty()
  readonly rating: number;

  @ApiProperty()
  readonly comment: string;

  @ApiProperty()
  readonly product: { id: number };
}
