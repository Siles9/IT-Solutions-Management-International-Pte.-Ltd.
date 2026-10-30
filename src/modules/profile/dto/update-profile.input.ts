import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

/**
 * Every field is optional: the mutation is a partial update of the primary profile.
 * `null` clears a nullable column, an omitted field keeps its current value.
 */
@InputType()
export class UpdateProfileInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  fullName?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  headline?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  description?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  location?: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string | null;

  @Field(() => String, { nullable: true, description: 'Absolute URL of the avatar image.' })
  @IsOptional()
  @IsUrl({ require_protocol: true })
  avatarUrl?: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUrl({ require_protocol: true })
  githubUrl?: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUrl({ require_protocol: true })
  linkedinUrl?: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUrl({ require_protocol: true })
  telegramUrl?: string | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUrl({ require_protocol: true })
  websiteUrl?: string | null;
}
