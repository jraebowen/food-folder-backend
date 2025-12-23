import { ERROR_STATUS } from "../utils/errors.js";

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.statusCode) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  res
    .status(err.status || ERROR_STATUS.INTERNAL_SERVER.code)
    .send(err.message || ERROR_STATUS.INTERNAL_SERVER.message);
};
