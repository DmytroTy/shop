import { ApiProperty } from '@nestjs/swagger';
import { Status } from '../../enums/status.enum';

export class UpdateOrderDto {
  @ApiProperty()
  readonly status: Status;
}
