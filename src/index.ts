import express, { Express, Request, Response } from "express";
import {
  authRoutes,
  userRoutes,
  deviceRoutes,
  academicRoutes,
  certificateRoutes,
} from "./infrastructure/http/routes";
import { errorHandler, generateKeyPair } from "./shared/helpers";
import { AppDataSource } from "./infrastructure/persistence/postgres/DatabaseConnection";
import environment from "./shared/infrastructure/Environment";
import { DecryptDataMiddleware } from "./infrastructure/http/middlewares/CryptoMiddleware";
import helmet from "helmet";
import colors from "colors";
import cors from "cors";

const app: Express = express();
const host = environment.HOST;
const port = environment.PORT;
const routePrefix = "api";
const corsOptions = {
  origin: "",
};

app.disable("x-powered-by");
app.use(express.json());
app.use(cors(corsOptions));
app.use(helmet());

app.get(`/${routePrefix}`, (_req: Request, res: Response) => {
  res.status(200).json({
    status: true,
    data: "Welcome, but nothing to show here",
  });
});
app.use(`/${routePrefix}/auth`, authRoutes);
app.use(`/${routePrefix}/user`, DecryptDataMiddleware, userRoutes);
app.use(`/${routePrefix}/academic`, DecryptDataMiddleware, academicRoutes);
app.use(`/${routePrefix}/device`, deviceRoutes);
app.use(
  `/${routePrefix}/certificate`,
  DecryptDataMiddleware,
  certificateRoutes
);

app.use(errorHandler);

const startServer = async () => {
  try {
    generateKeyPair();

    await AppDataSource.initialize();
    console.log(colors.green.bold(`Database connected!`));

    app.listen(port, host, () => {
      console.log(
        colors.green.bold(`Server is running on http://${host}:${port}`)
      );
    });
  } catch (error) {
    console.error(
      colors.red.bold(`Error during database connection: ${error}`)
    );
  }
};

startServer();
