import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";
import { env } from "./config/env";
import { logger } from "./lib/logger";

export function createApp() {
    const app = express();

    app.disable("x-powered-by");
    app.use(pinoHttp({ logger }));
    app.use(helmet());
    app.use(cors({ origin: env.WEB_ORIGIN, credentials: true }));
    app.use(
        rateLimit({
            windowMs: 60_000,
            limit: 100,
            standardHeaders: "draft-7",
            legacyHeaders: false,
        })
    );
    app.use(express.json({ limit: "100kb" }));

    app.get("/health", (_req, res) => {
        res.json({ status: "ok" });
    });

    app.use((_req, res) => {
        res.status(404).json({ error: "Not found" });
    });

    app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
        req.log.error(err);
        res.status(500).json({ error: "Internal server error" });
    });

    return app;
};