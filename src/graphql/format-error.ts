import type { GraphQLFormattedError } from 'graphql';

/**
 * Puts the message of an HttpException into the GraphQL error. By default Nest keeps only
 * the status text, so validation errors reach the client as "Bad Request Exception".
 *
 * Checks are structural instead of `instanceof`: under Vitest `@nestjs/common` is loaded
 * as ESM while the app uses CJS, and instanceof does not work across the two copies.
 */
export function formatGraphQLError(
  formattedError: GraphQLFormattedError,
  error: unknown,
): GraphQLFormattedError {
  const originalError = unwrapOriginalError(error);
  const response = readExceptionResponse(originalError);

  if (response === undefined) {
    return formattedError;
  }

  const message =
    typeof response === 'string' ? response : (response as { message?: string | string[] }).message;

  if (!message) {
    return formattedError;
  }

  return {
    ...formattedError,
    message: Array.isArray(message) ? message.join('; ') : message,
  };
}

function unwrapOriginalError(error: unknown): unknown {
  if (isRecord(error) && 'originalError' in error) {
    return (error as { originalError?: unknown }).originalError ?? error;
  }

  return error;
}

function readExceptionResponse(error: unknown): unknown {
  if (!isRecord(error) || typeof error.getResponse !== 'function') {
    return undefined;
  }

  try {
    return (error.getResponse as () => unknown)();
  } catch {
    return undefined;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
