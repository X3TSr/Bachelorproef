// Security middleware inspired from:
// https://dev.to/herjean7/nodejs-security-middlewares-36o3
// https://speakerdeck.com/ckarande/top-overlooked-security-threats-to-node-dot-js-web-applications?slide=1

import express, { Express } from "express";
import helmet from "helmet";
import cors from "cors";
// import { xss } from "express-xss-sanitizer";
import { rateLimit } from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import session from "express-session";
import methodOverride from "method-override";
import csrf from "csurf";

// Extend Express Request interface to include csrfToken() function added by csurf middleware
declare global {
  namespace Express {
    interface Request {
      csrfToken(): string;
    }
  }
}

// Type alias for CORS origin callback function signature
interface CorsOriginCallback {
  (err: Error | null, allow?: boolean): void;
}

// Type definition for the CORS options object used below
interface MyCorsOptions {
  origin: (
    origin: string | undefined,
    callback: CorsOriginCallback
  ) => string | void;
  optionsSuccessStatus: number;
}

/**
 * Registers all security and common middlewares on the provided Express app instance.
 * Configures parsing, rate limiting, data sanitization, security headers, CORS, sessions,
 * HTTP method overrides, CSRF protection, and Content Security Policy.
 *
 * @param app - Express application instance to register middleware on
 */
const registerMiddleware = (app: Express): void => {
  // --- Parsing Middleware --- //
  // Parses incoming JSON requests and makes the data available under req.body
  app.use(express.json());

  // --- Rate Limiting Middleware --- //
  // Limits repeated requests to APIs to prevent brute-force or denial-of-service attacks
  // Reads rate limit window duration and max attempts from environment variables
  const RATELIMIT_PERIOD = parseInt(process.env.API_RATELIMIT_PERIOD || "10");
  const RATE_ATTEMPTS = parseInt(process.env.API_RATELIMIT_ATTEMPTS || "100");
  const limiter = rateLimit({
    windowMs: RATELIMIT_PERIOD * 60 * 1000, // window duration in milliseconds (default 10 minutes)
    max: RATE_ATTEMPTS, // max requests allowed per IP per window (default 100)
    legacyHeaders: false, // disables deprecated rate limit headers
  });
  app.use(limiter);

  // --- Data Sanitization Middleware --- //
  // Sanitizes data to prevent NoSQL injection attacks, enabled only if MongoDB is used
  if (process.env.API_MONGODB_ENABLED) app.use(mongoSanitize());

  // --- Security Headers Middleware --- //
  // Adds various HTTP headers to improve app security using Helmet
  app.use(helmet());        // sets common security headers
  app.use(helmet.noSniff());  // prevents browsers from MIME-sniffing responses
  app.use(helmet.xssFilter()); // sets X-XSS-Protection header to enable XSS filtering
  app.use(helmet.hidePoweredBy()); // hides the 'X-Powered-By' header for obscurity
  app.disable("x-powered-by");      // disables X-Powered-By header explicitly

  // --- XSS and HTTP Parameter Pollution Protection --- //
  // Optional: Cross-site scripting sanitizer middleware (commented out)
  // app.use(xss());

  // Prevents HTTP Parameter Pollution attacks by removing duplicate query params
  app.use(hpp());

  // --- CORS Middleware --- //
  // Enables Cross-Origin Resource Sharing, allowing only whitelisted origins
  // Reads whitelist from environment variable, expects comma-separated URLs
  const whitelist = process.env.API_CORS_WHITELIST ? process.env.API_CORS_WHITELIST.split(',') : [];
  const corsOptions: MyCorsOptions = {
    origin: (
      origin: string | undefined,
      callback: CorsOriginCallback
    ): string | void => {
      // Allow requests with no origin (e.g. mobile apps or curl) or those in the whitelist
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);  // Allow the request
      } else {
        callback(new Error("Not allowed by CORS")); // Reject request with CORS error
      }
    },
    optionsSuccessStatus: 200, // Response status for successful OPTIONS preflight requests
  };
  app.use(cors(corsOptions));

  // --- Session Middleware --- //
  // Enables session management with secure cookies, secret and cookie name required from env
  const session_secret = process.env.API_SESSION_SECRET;
  const session_name = process.env.API_SESSION_NAME;
  if (!session_secret || !session_name) throw new Error("Something went horribly wrong! Contact support!");
  app.use(
    session({
      secret: session_secret, // Secret used to sign session ID cookie
      name: session_name,     // Custom session cookie name
      cookie: {
        httpOnly: true,       // Mitigate XSS by restricting client-side JS access to cookie
        secure: true,         // Only send cookie over HTTPS connections
      },
    })
  );

  // --- Method Override Middleware --- //
  // Allows overriding HTTP methods via the 'X-HTTP-Method-Override' header, useful for clients that don't support PUT/DELETE
  app.use(methodOverride("X-HTTP-Method-Override"));

  // --- CSRF Protection Middleware --- //
  // Enables Cross-Site Request Forgery protection, disabled in development for ease of debugging
  if (process.env.NODE_ENV !== "development") {
    app.use(csrf());

    // Middleware to expose the CSRF token via res.locals for templating or client-side use
    app.use((req, res, next) => {
      res.locals.csrfToken = req.csrfToken();
      next();
    });
  }

  // --- Content Security Policy Middleware --- //
  // Sets a Content Security Policy to restrict sources for content like scripts, images, etc.
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],     // Only allow resources from same origin by default
        imgSrc: [
          "http://localhost:3001", // Allow images from localhost:3001 (adjust as needed)
        ],
      },
    })
  );
};

export { registerMiddleware };
