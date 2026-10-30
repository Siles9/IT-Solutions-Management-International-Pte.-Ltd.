import { BadRequestException } from '@nestjs/common';
import type { ValidationError } from 'class-validator';

/**
 * Turns class-validator output into one readable sentence per invalid field.
 * Without this, GraphQL clients would only see the generic "Bad Request Exception".
 */
export function validationExceptionFactory(errors: ValidationError[]): BadRequestException {
  return new BadRequestException(flattenValidationErrors(errors));
}

export function flattenValidationErrors(errors: ValidationError[], parentPath = ''): string[] {
  return errors.flatMap((error) => {
    const path = parentPath ? `${parentPath}.${error.property}` : error.property;
    const ownMessages = Object.values(error.constraints ?? {}).map(
      (message) => `${path}: ${message}`,
    );
    const childMessages = error.children?.length
      ? flattenValidationErrors(error.children, path)
      : [];

    return [...ownMessages, ...childMessages];
  });
}
