import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';

import { SkillCategory } from '../../../database/prisma-client';

@InputType()
export class SkillFilterInput {
  @Field(() => SkillCategory, { nullable: true })
  @IsOptional()
  @IsEnum(SkillCategory)
  category?: SkillCategory;
}
