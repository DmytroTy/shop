import { Field, InputType, Int } from '@nestjs/graphql';
import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty, Min } from 'class-validator';

@InputType({ description: 'Product data for checkout' })
class ProductInput {
  @Field(type => Int)
  @IsInt()
  @Min(1)
  id: number;

  @Field(type => Int)
  @IsInt()
  @Min(1)
  quantity: number;
}

@InputType({ description: 'Data for checkout' })
export class CheckoutInput {
  @Field()
  @IsNotEmpty()
  paymentMethodNonce: string;

  @Field({ nullable: true })
  clientDeviceData: string;

  @Field(type => [ProductInput])
  @IsArray()
  @ArrayNotEmpty()
  orderProducts: ProductInput[];
}
