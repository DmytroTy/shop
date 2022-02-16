import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateBuyerDto } from './create-buyer.dto';

export class UpdateBuyerDto extends PartialType(OmitType(CreateBuyerDto, ['facebookId'] as const)) {}
