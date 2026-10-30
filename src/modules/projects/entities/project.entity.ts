import { Field, ID, ObjectType } from '@nestjs/graphql';
import { GraphQLISODateTime } from '@nestjs/graphql';

import { Skill } from '../../skills/entities/skill.entity';

@ObjectType({ description: 'A portfolio project with the technologies it uses.' })
export class Project {
  @Field(() => ID)
  id: string;

  @Field({ description: 'Unique, URL-friendly identifier.' })
  slug: string;

  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => String, { nullable: true, description: 'Live demo, when available.' })
  url?: string | null;

  @Field(() => String, { nullable: true, description: 'Source code repository.' })
  repositoryUrl?: string | null;

  @Field(() => Boolean, { description: 'Featured projects are highlighted in client UIs.' })
  featured: boolean;

  @Field(() => GraphQLISODateTime, { nullable: true })
  startDate?: Date | null;

  @Field(() => GraphQLISODateTime, { nullable: true })
  endDate?: Date | null;

  @Field(() => [Skill], { description: 'Technologies used in the project.' })
  technologies: Skill[];
}
