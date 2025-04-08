import createHttpError from 'http-errors';
import { searchByName } from '../../services/searchByName.js';

export const searchByNameController = async (req, res) => {
  const { name, role } = req.query;

  if (!name) {
    throw new createHttpError(400, 'Name is required');
  }

  const result = await searchByName(name, role);

  if (!result.length) {
    throw new createHttpError(404, `No profiles found with name "${name}"`);
  }

  res.status(200).json({
    status: 200,
    message: `Found profiles with name "${name}"`,
    profiles: result,
  });
};
