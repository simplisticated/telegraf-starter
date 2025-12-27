import compression from "compression";
import helmet from "helmet";
import express from "express";
import cors from "cors";
import * as fsPromises from "fs/promises";
import http from "http";
import https from "https";
import ENV from "../app/env";
import PATH from "../app/path";
import { mainEndpoint } from "./api/main";

function createServerApp() {
    const app = express();

    app.use(cors());
    app.use(compression());
    app.use(helmet());
    app.disable("x-powered-by");
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    if (ENV.LOG_SERVER_REQUESTS) {
        app.use((request, response, next) => {
            const report = [
                request.method,
                request.url,
                Object.keys(request.body).length > 0
                    ? JSON.stringify(request.body, null, 2)
                    : undefined,
            ]
                .filter(value => value !== undefined)
                .join(" ");
            console.log(report);
            next();
        });
    }

    // API
    app.get("/", mainEndpoint);

    // 404
    app.use((_req, res) => res.status(404).send("Not found."));

    // Error handler
    app.use(
        (error: any, _request: express.Request, response: express.Response) => {
            console.error(error);
            response.status(500).send("Internal server error.");
        }
    );

    return app;
}

export async function createServer(configuration: { useHttps: boolean }) {
    const app = createServerApp();
    if (configuration.useHttps) {
        return https.createServer(
            {
                key: await fsPromises.readFile(PATH.certificateFiles().key_pem),
                cert: await fsPromises.readFile(
                    PATH.certificateFiles().cert_pem
                ),
            },
            app
        );
    }
    return http.createServer(app);
}
