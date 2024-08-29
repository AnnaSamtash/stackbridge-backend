import createHttpError from 'http-errors';
import swaggerUI from 'swagger-ui-express';
import * as fs from 'node:fs';
import { SWAGGER_PATH } from '../constants/index.js';

export const swaggerDocs = (req, res, next) => {
  try {
    const swaggerDoc = JSON.parse(fs.readFileSync(SWAGGER_PATH).toString());
    return [...swaggerUI.serve, swaggerUI.setup(swaggerDoc)];
  } catch {
    next(createHttpError(500, "Can't load swagger docs"));
    return;
  }
};
