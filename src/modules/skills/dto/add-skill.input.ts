import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

import { SkillCategory, SkillLevel } from '../../../database/prisma-client';

@InputType()
export class AddSkillInput {
  @Field({ description: 'Catalogue entries are unique by name; duplicates are reused.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  name: string;

  @Field(() => SkillCategory, {
    description: 'Used only when the catalogue entry is created for the first time.',
  })
  @IsEnum(SkillCategory)
  category: SkillCategory;

  @Field(() => SkillLevel, { nullable: true, defaultValue: SkillLevel.INTERMEDIATE })
  @IsOptional()
  @IsEnum(SkillLevel)
  level?: SkillLevel;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(50)
  yearsOfExperience?: number | null;
}
