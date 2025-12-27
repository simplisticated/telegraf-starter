import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import * as fsPromises from "fs/promises";
import http from "http";
import https from "https";
import ENV from "../app/env";
import PATH from "../app/path";

function createServerApp() {
    const app = express();

    app.use(cors());
    app.use(compression());
    app.use(helmet());
    app.disable("x-powered-by");
    app.use(express.json());

    if (ENV.LOG_SERVER_REQUESTS) {
        app.use((request, _response, next) => {
            console.log(`${request.method} ${request.url}`, request.body || "");
            next();
        });
    }

    // API
    app.get("/", (request, response) => {
        response.send("Hello");
    });

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

async function createServer(configuration: {
    app: express.Express;
    useHttps: boolean;
}) {
    if (configuration.useHttps) {
        return https.createServer(
            {
                key: await fsPromises.readFile(PATH.certificateFiles().key_pem),
                cert: await fsPromises.readFile(
                    PATH.certificateFiles().cert_pem
                ),
            },
            configuration.app
        );
    }
    return http.createServer(configuration.app);
}

async function startListening(
    server: http.Server | https.Server,
    port: number
): Promise<boolean> {
    return new Promise(resolve => {
        server
            .listen(port, undefined, undefined, () => {
                resolve(true);
            })
            .on("error", error => {
                console.error("Server failed to start:", error);
                resolve(false);
            });
    });
}

export async function startServer(port: number): Promise<boolean> {
    const app = createServerApp();
    const server = await createServer({
        app,
        useHttps: ENV.USE_HTTPS,
    });
    server.addListener("error", console.error);
    return startListening(server, port);
}
