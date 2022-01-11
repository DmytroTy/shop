import { ApiProperty } from '@nestjs/swagger';

export class AddOrdersProductDto {
  @ApiProperty()
  readonly quantity: number;

  // readonly orderId: number;

  @ApiProperty()
  readonly productId: number;
}
