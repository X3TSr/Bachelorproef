import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AuthenticatedRequest } from '../../types/authTypes';

/**
 * Verifies a JWT token asynchronously.
 * Attaches decoded token payload to req.user if valid.
 * Sends 401 Unauthorized response if verification fails.
 * 
 * @param req - Authenticated Express request extended with `user` property
 * @param res - Express response object
 * @param next - Express next middleware callback
 * @param token - JWT token string to verify
 */
export function verifyToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
  token?: string | string[] | undefined
): void {
  const secretOrPublicKey = process.env.JWT_SECRET_OR_PUBLIC_KEY;
  if (!secretOrPublicKey) {
    throw new Error('JWT secret or public key is not defined in environment variables.');
  }

  jwt.verify(
    token as string, // Cast token to string; should be validated upstream
    secretOrPublicKey,
    (err: jwt.VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
      if (err) {
        console.error('JWT verification failed:', err.message);
        return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
      }

      // Attach decoded token payload to the request object for downstream use
      req.user = decoded;
      next();
    }
  );
}

/**
 * Express middleware to authenticate incoming requests using Bearer token in Authorization header.
 * Extracts token, verifies it, and calls next() if valid.
 * Sends 401 Unauthorized if no valid token is present.
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware callback
 */
export function authenticate(req: Request, res: Response, next: NextFunction) {
  // Retrieve the authorization header value, supports array or string
  const authHeader = Array.isArray(req.headers.authorization)
    ? req.headers.authorization[0]
    : req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Extract Bearer token from Authorization header (case-insensitive match)
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match || !match[1]) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = match[1].trim();

  verifyToken(req as AuthenticatedRequest, res, next, token);
}
