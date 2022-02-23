import { InputType, PartialType } from '@nestjs/graphql';
import { CreateProductDto } from './create-product.dto';

@InputType()
export class UpdateProductInput extends PartialType(CreateProductDto) {}
