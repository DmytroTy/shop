import { ApiProperty } from '@nestjs/swagger';
import { CreateProductDto } from "src/products/dto/create-product.dto";

export class AddOrderProductDto extends CreateProductDto {
  @ApiProperty()
  readonly id: number;
}
