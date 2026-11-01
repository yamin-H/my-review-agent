import pino from "pino";
import { env } from "../config/env";

export const logger = pino({
    level: env.LOG_LEVEL,
    redact: ["req.headers.authorization", "req.headers.cookie", "req.headers['x-hub-signature-256']"],
    transport:
        env.NODE_ENV === "development"
            ? { target: "pino-pretty", options: { colorize: true } }
            : undefined,
});