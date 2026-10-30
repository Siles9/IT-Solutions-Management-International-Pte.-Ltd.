import { timingSafeEqual } from 'node:crypto';

import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';

import type { GraphQLContext } from '../../graphql/graphql.context';

/**
 * Reads are public, writes change the owner's data. When MUTATION_API_KEY is set,
 * a mutation needs the matching `x-api-key` header; otherwise it stays open.
 */
@Injectable()
export class MutationApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const expectedKey = this.configService.get<string>('MUTATION_API_KEY');

    if (!expectedKey) {
      return true;
    }

    const gqlContext = GqlExecutionContext.create(context).getContext<GraphQLContext>();
    const providedKey = gqlContext.request?.header('x-api-key');

    if (!providedKey || !this.keysMatch(providedKey, expectedKey)) {
      throw new UnauthorizedException('A valid x-api-key header is required to run mutations');
    }

    return true;
  }

  private keysMatch(provided: string, expected: string): boolean {
    const providedBuffer = Buffer.from(provided);
    const expectedBuffer = Buffer.from(expected);

    return (
      providedBuffer.length === expectedBuffer.length &&
      timingSafeEqual(providedBuffer, expectedBuffer)
    );
  }
}
