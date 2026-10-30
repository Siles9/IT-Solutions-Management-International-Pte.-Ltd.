import { join } from 'node:path';

import type { Request } from 'express';

import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';

import { NodeEnvironment } from '../config/environment';
import { DataLoadersFactory } from './data-loaders.factory';
import { DataLoadersModule } from './data-loaders.module';
import { formatGraphQLError } from './format-error';
import type { GraphQLContext } from './graphql.context';

/**
 * Apollo setup. Schema is generated from decorators into schema.gql.
 * `/graphql` has no built-in IDE: the Sandbox is served from `/` by LandingController.
 */
@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [DataLoadersModule],
      inject: [DataLoadersFactory, ConfigService],
      useFactory: (
        dataLoadersFactory: DataLoadersFactory,
        configService: ConfigService,
      ): ApolloDriverConfig => ({
        path: '/graphql',
        autoSchemaFile: join(process.cwd(), 'schema.gql'),
        sortSchema: true,
        graphiql: false,
        introspection: true,
        includeStacktraceInErrorResponses:
          configService.get('NODE_ENV') !== NodeEnvironment.Production,
        formatError: formatGraphQLError,
        context: ({ req }: { req: Request }): GraphQLContext => ({
          loaders: dataLoadersFactory.create(),
          request: req,
        }),
      }),
    }),
    DataLoadersModule,
  ],
})
export class ApiGraphqlModule {}
