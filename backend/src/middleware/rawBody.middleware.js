/**
 * Preserves raw request body buffer for webhook HMAC signature verification.
 */
export const rawBodyMiddleware = (req, _res, buf) => {
  if (buf && buf.length) {
    req.rawBody = buf;
  }
};

