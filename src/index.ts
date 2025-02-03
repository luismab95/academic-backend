import express, { Express, NextFunction, Request, Response } from "express";
import environment from "./shared/infrastructure/Environment";
import colors from "colors";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const host = environment.HOST;
const port = environment.PORT;

app.use(express.json());
app.use(cors());

app.use("/api", (req: Request, res: Response, next: NextFunction) => {
  next();
});

app.get("/api", (req: Request, res: Response) => {
  res.status(200).json({
    status: true,
    data: "Welcomo, but nothing to show here",
  });
});

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  res.status(400);
  if (err instanceof Error) {
    console.error(colors.red.bold(err.stack));
    res.json({
      status: false,
      data: err.message,
    });
  }
  console.error(colors.red.bold(err as string));
  res.json({
    status: false,
    data: err as string,
  });
});

app.listen(port, host, () => {
  console.log(colors.green.bold(`Server is running on http://${host}:${port}`));
});
