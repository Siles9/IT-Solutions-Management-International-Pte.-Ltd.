import { Field, ID, ObjectType } from '@nestjs/graphql';
import { GraphQLISODateTime } from '@nestjs/graphql';

import { Experience } from '../../experience/entities/experience.entity';
import { Project } from '../../projects/entities/project.entity';
import { Skill } from '../../skills/entities/skill.entity';
import { ProfileLink } from './profile-link.entity';

@ObjectType({ description: 'Public digital business card of a specialist.' })
export class Profile {
  @Field(() => ID)
  id: string;

  @Field({ description: 'Stable, human-readable identifier used by the seed and CLI tools.' })
  slug: string;

  @Field()
  fullName: string;

  @Field({ description: 'One-line positioning, e.g. "Backend-разработчик · TypeScript / NestJS".' })
  headline: string;

  @Field()
  description: string;

  @Field(() => String, { nullable: true })
  location?: string | null;

  @Field(() => String, { nullable: true })
  email?: string | null;

  @Field(() => String, { nullable: true })
  avatarUrl?: string | null;

  @Field(() => [ProfileLink], {
    description: 'Only the professional links that are actually filled in.',
  })
  links: ProfileLink[];

  @Field(() => [Skill], { description: 'Skills attached to this profile, in curated order.' })
  skills: Skill[];

  @Field(() => [Experience], { description: 'Work history, newest first.' })
  experience: Experience[];

  @Field(() => [Project], { description: 'Portfolio projects, featured first.' })
  projects: Project[];

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}
