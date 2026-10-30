import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';

import { SkillCategory, SkillLevel } from '../../../database/prisma-client';

registerEnumType(SkillCategory, {
  name: 'SkillCategory',
  description: 'Broad grouping used to filter the skill catalogue.',
});

registerEnumType(SkillLevel, {
  name: 'SkillLevel',
  description: 'Self-assessed proficiency level for a skill attached to a profile.',
});

@ObjectType({ description: 'A technology or skill from the shared catalogue.' })
export class Skill {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => SkillCategory)
  category: SkillCategory;

  @Field(() => SkillLevel, {
    nullable: true,
    description: 'Level within the current profile. Only populated on `Profile.skills`.',
  })
  level?: SkillLevel | null;

  @Field(() => Int, {
    nullable: true,
    description: 'Years of hands-on experience. Only populated on `Profile.skills`.',
  })
  yearsOfExperience?: number | null;
}
