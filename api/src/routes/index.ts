import { Express, Router, ErrorRequestHandler, RequestHandler } from 'express';
import { errorHandler } from '../middleware/error/errorHandlerMiddleware';
import { authenticate } from '../middleware/auth/authMiddleware';

const registerRoutes = (app: Express): void => {

  const noAuthRoutes = Router();
  noAuthRoutes.get('/status', (req, res) => {
    const status = {
      "Status": "Running",
      "Version": process.env.VERSION
    };
    res.send(status);
  });

  const authRoutes = Router();


  // Register the routes that do not require authentication first.
  // This allows unauthenticated users to access the status endpoint.
  app.use(noAuthRoutes);

  // Register the authentication middleware and the routes together.
  // This ensures that only authenticated requests can access the routes defined in authRoutes.
  app.use(authenticate as unknown as RequestHandler, authRoutes);

  // Finally, setup the global error handling middleware to catch and process errors.
  app.use(errorHandler as unknown as ErrorRequestHandler);
}

export { registerRoutes };