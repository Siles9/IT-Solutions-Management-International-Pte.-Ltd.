import { plainToInstance, Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  validateSync,
} from 'class-validator';

export enum NodeEnvironment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

/** Environment variables the app accepts, checked once on startup. */
export class EnvironmentVariables {
  @IsString()
  @IsNotEmpty({ message: 'DATABASE_URL is required (see .env.example)' })
  DATABASE_URL: string;

  @IsOptional()
  @IsEnum(NodeEnvironment)
  NODE_ENV: NodeEnvironment = NodeEnvironment.Development;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(65535)
  PORT = 3000;

  /** When set, mutations require the `x-api-key` header. */
  @IsOptional()
  @IsString()
  MUTATION_API_KEY?: string;

  /** Comma-separated list of allowed origins, empty means any. */
  @IsOptional()
  @IsString()
  CORS_ORIGINS?: string;

  /** "false" disables seeding an empty database on startup. */
  @IsOptional()
  @IsIn(['true', 'false'])
  SEED_ON_START: string = 'true';
}

export function validateEnvironment(config: Record<string, unknown>): EnvironmentVariables {
  const parsed = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
    exposeDefaultValues: true,
  });

  const errors = validateSync(parsed, { skipMissingProperties: false, whitelist: false });

  if (errors.length > 0) {
    const details = errors
      .flatMap((error) => Object.values(error.constraints ?? {}))
      .join('\n  - ');

    throw new Error(`Invalid environment configuration:\n  - ${details}`);
  }

  return parsed;
}
