import { Field, ID, ObjectType } from '@nestjs/graphql';
import { GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType({ description: 'A position held by the profile owner.' })
export class Experience {
  @Field(() => ID)
  id: string;

  @Field()
  company: string;

  @Field()
  position: string;

  @Field(() => GraphQLISODateTime)
  startDate: Date;

  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: '`null` means the position is still ongoing.',
  })
  endDate?: Date | null;

  @Field(() => Boolean, {
    description: 'Derived from `endDate`: true while the position is ongoing.',
  })
  isCurrent: boolean;

  @Field(() => String, { nullable: true })
  summary?: string | null;

  @Field(() => [String], { description: 'Concrete, verifiable results.' })
  achievements: string[];
}
