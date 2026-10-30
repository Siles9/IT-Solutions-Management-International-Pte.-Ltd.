import { Field, GraphQLISODateTime, InputType } from '@nestjs/graphql';
import {
  ArrayMaxSize,
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

@InputType()
export class AddExperienceInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  company: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  position: string;

  @Field(() => GraphQLISODateTime)
  @IsDate()
  startDate: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @IsOptional()
  @IsDate()
  endDate?: Date | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  summary?: string | null;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MaxLength(300, { each: true })
  achievements?: string[];
}
