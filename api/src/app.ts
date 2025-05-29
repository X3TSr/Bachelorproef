import express, { Express } from "express";
import { registerRoutes } from "./routes";
import { registerMiddleware } from "./middleware";

require('dotenv').config();

// Set up express app
const app: Express = express();

// Register middleware
registerMiddleware(app);

// Register routes
registerRoutes(app);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

export default app;
