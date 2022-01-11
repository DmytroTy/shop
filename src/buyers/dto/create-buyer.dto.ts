import { ApiProperty } from '@nestjs/swagger';

export class CreateBuyerDto {
  @ApiProperty()
  readonly email: string;

  @ApiProperty()
  readonly username: string;

  @ApiProperty()
  password: string;
}
