import { Field, GraphQLISODateTime, InputType } from '@nestjs/graphql';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
} from 'class-validator';

@InputType()
export class AddProjectInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @Field(() => String, {
    nullable: true,
    description: 'Generated from the name when omitted.',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug must contain lowercase latin letters, digits and single dashes',
  })
  slug?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUrl({ require_protocol: true })
  url?: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUrl({ require_protocol: true })
  repositoryUrl?: string | null;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @IsOptional()
  @IsDate()
  startDate?: Date | null;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @IsOptional()
  @IsDate()
  endDate?: Date | null;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @Field(() => [String], {
    nullable: true,
    description: 'Technology names; missing catalogue entries are created automatically.',
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(30)
  @IsString({ each: true })
  @MaxLength(60, { each: true })
  technologies?: string[];
}
