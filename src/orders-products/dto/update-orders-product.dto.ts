import { PartialType } from '@nestjs/mapped-types';
import { AddOrdersProductDto } from './add-orders-product.dto';

export class UpdateOrdersProductDto extends PartialType(AddOrdersProductDto) {}
