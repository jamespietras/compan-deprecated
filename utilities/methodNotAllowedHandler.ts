import { Response } from 'express';
import * as HttpStatus from 'http-status-codes';

function methodNotAllowedHandler({}, response: Response, {}): void {
  response.status(HttpStatus.METHOD_NOT_ALLOWED).json();
}

export default methodNotAllowedHandler;
