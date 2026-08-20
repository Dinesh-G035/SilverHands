/**
 * Standardized successful API response helper.
 * @param {import('express').Response} res
 * @param {any} data
 * @param {string} [message="Success"]
 * @param {number} [statusCode=200]
 * @param {object} [meta=null]
 */
export const sendSuccess = (res, data, message = 'Success', statusCode = 200, meta = null) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(meta ? { meta } : {}),
  });
};

/**
 * Standardized error API response helper.
 * @param {import('express').Response} res
 * @param {string} [message="Internal Server Error"]
 * @param {number} [statusCode=500]
 * @param {any} [errors=null]
 */
export const sendError = (res, message = 'Internal Server Error', statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
  });
};

