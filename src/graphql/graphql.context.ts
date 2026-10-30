import type { Request } from 'express';

import type { DataLoaders } from './data-loaders';

/** Context built for every request: fresh loaders plus the raw HTTP request. */
export interface GraphQLContext {
  readonly loaders: DataLoaders;
  readonly request: Request;
}
