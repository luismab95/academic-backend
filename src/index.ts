import express, { Express, Request, Response } from "express";
import {
  authRoutes,
  userRoutes,
  deviceRoutes,
} from "./infrastructure/http/routes";
import { errorHandler, generateKeyPairSync } from "./shared/helpers";
import { AppDataSource } from "./infrastructure/persistence/postgres/DatabaseConnection";
import environment from "./shared/infrastructure/Environment";
import { DecryptDataMiddleware } from "./infrastructure/http/middlewares/CryptoMiddleware";
import colors from "colors";
import cors from "cors";

const app: Express = express();
const host = environment.HOST;
const port = environment.PORT;
const routePrefix = "api";

app.use(express.json());
app.use(cors());

app.get(`/${routePrefix}`, (_req: Request, res: Response) => {
  res.status(200).json({
    status: true,
    data: "Welcome, but nothing to show here",
  });
});
app.use(`/${routePrefix}/auth`, DecryptDataMiddleware, authRoutes);
app.use(`/${routePrefix}/user`, DecryptDataMiddleware, userRoutes);
app.use(`/${routePrefix}/device`, DecryptDataMiddleware, deviceRoutes);

app.use(errorHandler);

const startServer = async () => {
  try {
    // generateKeyPairSync();

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
