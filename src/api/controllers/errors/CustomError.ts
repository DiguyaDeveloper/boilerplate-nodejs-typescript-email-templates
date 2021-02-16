import { HttpError } from 'routing-controllers';

import { fixStack } from './utils';

export class CustomError extends HttpError {
  public property: string;

  constructor(status?: number, message?: string, property?: any) {
    super(status, message);
    this.property = property;

    Object.defineProperty(this, 'name', {
      value: new.target.name,
      enumerable: false,
      configurable: true,
    });

    fixStack(this);
  }
}
