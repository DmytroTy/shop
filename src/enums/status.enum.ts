import { registerEnumType } from '@nestjs/graphql'

export enum Status {
  OPENLY = "openly",
  PROCESSED = "processed",
  CANCELED = "canceled"
}

registerEnumType(Status, {
  name: 'Status',
  description: 'The supported order statuses.',
});

