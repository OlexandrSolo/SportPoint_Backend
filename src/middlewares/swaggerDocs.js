import createHttpError from 'http-errors';
import fs from 'node:fs';
import swaggerUI from 'swagger-ui-express';
import { SWAGGER_PAT } from '../constants/swagger.js';

export const swaggerDocs = () => {
  try {
    const swaggerDocs = JSON.parse(fs.readFileSync(SWAGGER_PAT).toString());
    return [...swaggerUI.serve, swaggerUI.setup(swaggerDocs)];
  } catch (err) {
    return (req, res, next) =>
      next(createHttpError(500, 'Cannot load swagger docs', err));
  }
};
