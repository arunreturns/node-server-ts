import express from "express";
import dotenv from "dotenv";
import chalk from "chalk";
import ServerConfig from "./config/ServerConfig";
import DatabaseConfig from "./config/DatabaseConfig";
import Logger from "./config/LoggerConfig";
import AuthController from "./controller/AuthController";
import CustomerController from "./controller/CustomerController";

const app: express.Application = express();
dotenv.config();
/* Configure and connect to the database */
DatabaseConfig.connectToDatabase(app);
/* Configure the server with additional features */
ServerConfig.configureServer(app);

/* Connect the various routes to the application */
AuthController.registerController(app);
CustomerController.registerController(app);

const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  Logger.info(
    `${chalk.yellow("★")} Application running in http://${HOST}:${PORT}`,
  );
});

export default app;
