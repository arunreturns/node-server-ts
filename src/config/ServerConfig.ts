import chalk from "chalk";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import initStats from "@phil-r/stats";
import errorhandler from "errorhandler";
import cors from "cors";
import expressStatusMonitor from "express-status-monitor";
import protect from "@risingstack/protect";
import csrf from "csurf";
import logger, { morganStream } from "../config/LoggerConfig";
import { Application } from "express";

class ServerConfig {
  static configureServer(app: Application) {
    logger.info(`${chalk.yellow("⚒")} Configuring server`);

    // Use /stats to check the endpoint stats
    const { statsMiddleware, getStats } = initStats({
      endpointStats: true,
      customStats: true,
      addHeader: true,
    });

    /* Log API requests */
    app.use(
      morgan("dev", {
        stream: morganStream,
      }),
    );
    /* Use methodOverride */
    app.use(methodOverride("X-HTTP-Method-Override"));
    /* Helmet is actually just a collection of nine smaller middleware functions
     that set security-related HTTP headers */
    app.use(helmet());
    /* Gzip compressing can greatly decrease the size of the response body
     and hence increase the speed of a web app */
    app.use(compression());
    /* Middleware for monitoring express status */
    // Use /status to check the app running status
    app.use(expressStatusMonitor());
    /* Stats */
    app.use(statsMiddleware);
    app.get("/stats", (req, res) => res.send(getStats()));

    /* Enable CORS */
    app.use(cors());

    if (process.env.NODE_ENV === "development") {
      // Only add errorHandler for development
      app.use(errorhandler());
    }
    /* Protect the API */
    app.use(
      protect.express.sqlInjection({
        body: true,
        loggerFunction: logger.error,
      }),
    );

    /* Use bodyParser */
    app.use(bodyParser.json());
    app.use(bodyParser.json({ type: "application/vnd.api+json" }));
    app.use(bodyParser.urlencoded({ extended: false }));

    /* Use cookieParser */
    app.use(cookieParser());

    /* Enable CSRF */
    app.use(csrf({ cookie: true }));

    /* Protect against XSS */
    app.use(protect.express.xss({ body: true, loggerFunction: logger.error }));

    // app.use(protect.express.rateLimiter({   db: client,   id: (request) =>
    // request.connection.remoteAddress }))

    logger.info(`${chalk.yellow("⚒")} Server configuration completed`);
  }
}

export default ServerConfig;
