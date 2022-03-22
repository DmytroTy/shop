import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumberString, IsOptional } from 'class-validator';

@InputType()
export class CreateBuyerDto {
  @Field()
  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @Field()
  @ApiProperty()
  @IsNotEmpty()
  readonly username: string;

  @Field()
  @ApiProperty()
  @IsNotEmpty()
  password?: string;

  @Field({ nullable: true })
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  readonly facebookId?: string;
}
