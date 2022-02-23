import { InputType, PartialType } from '@nestjs/graphql';
import { CreateBuyerDto } from './create-buyer.dto';

@InputType()
export class UpdateBuyerInput extends PartialType(CreateBuyerDto) {}
