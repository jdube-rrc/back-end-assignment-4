import express, { Express } from "express";
import morgan from "morgan";
import loanRoutes from "./api/v1/routes/loanRoutes";
import { 
    accessLogger, 
    errorLogger, 
    consoleLogger } from "./api/v1/middleware/logger";
import errorHandler from "./api/v1/middleware/errorHandler";

const app: Express = express();

if (process.env.NODE_ENV === "production") {
    app.use(accessLogger);
    app.use(errorLogger);
} else {
    app.use(consoleLogger);
}

interface HealthCheckResponse {
    status: string;
    uptime: number;
    timestamp: string;
    version: string;
}

app.use (express.json());
app.use(morgan("combined"));

app.get("/api/v1/health", (req: express.Request, res: express.Response) => {
    const healthData: HealthCheckResponse = {
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    };

    res.json(healthData);
});

app.use("api/v1/loans", loanRoutes);

app.use(errorHandler);

export default app;