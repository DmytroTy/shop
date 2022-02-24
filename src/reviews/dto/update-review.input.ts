import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreateReviewDto } from './create-review.dto';

@InputType()
export class UpdateReviewInput extends PartialType(OmitType(CreateReviewDto, ['productId'] as const)) {}
