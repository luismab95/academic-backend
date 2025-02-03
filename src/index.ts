import express, { Express, Request, Response } from "express";
import { authRoutes } from "./infrastructure/http/routes/AuthRoutes";
import { userRoutes } from "./infrastructure/http/routes/UserRoute";
import { ErrorHandler } from "./shared/helpers/ResponseHelper";
import { AppDataSource } from "./infrastructure/persistence/postgres/DatabaseConnection";
import environment from "./shared/infrastructure/Environment";
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
app.use(`/${routePrefix}/auth`, authRoutes);
app.use(`/${routePrefix}/user`, userRoutes);
app.use(ErrorHandler);

const startServer = async () => {
  try {
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
