import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';

import { renderApolloSandboxPage } from './apollo-sandbox.page';

@Controller()
export class LandingController {
  /**
   * Human entry point of the service: Apollo Sandbox wired to `/graphql`.
   * A plain HTML response keeps the API dependency-free (no frontend build step).
   */
  @Get()
  sandbox(@Res() response: Response): void {
    response.type('html').send(renderApolloSandboxPage());
  }
}
