import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty()
  readonly type: string;

  @ApiProperty()
  readonly color: string;

  @ApiProperty()
  readonly price: number;

  @ApiProperty()
  readonly quantity: number;
}
