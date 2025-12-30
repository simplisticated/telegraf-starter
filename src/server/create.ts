import compression from "compression";
import helmet from "helmet";
import express from "express";
import cors from "cors";
import * as fsPromises from "fs/promises";
import http from "http";
import https from "https";
import path from "path";
import { engine } from "express-handlebars";
import ENV from "../app/env";
import PATH from "../app/path";
import { launchBot } from "./api/bot/launch";
import { stopBot } from "./api/bot/stop";
import STORE from "../data/store/store";

function createServerApp() {
    const app = express();

    app.use(cors());
    app.use(compression());
    app.use(
        helmet({
            contentSecurityPolicy: false,
        })
    );
    app.disable("x-powered-by");
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.engine(
        "hbs",
        engine({
            extname: "hbs",
            layoutsDir: path.join(__dirname, "views/layouts"),
            partialsDir: path.join(__dirname, "views/fragments"),
            defaultLayout: "main",
        })
    );
    app.set("view engine", "hbs");
    app.set("views", path.join(__dirname, "views"));

    app.use("/", express.static(path.join(__dirname, "public")));

    if (ENV.LOG_SERVER_REQUESTS) {
        app.use((request, response, next) => {
            const report = [
                request.method,
                request.url,
                request.body !== undefined &&
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
    app.get("/", (request, response) => {
        response.render("pages/main", {
            data: {
                title: "Main",
            },
        });
    });
    app.get("/telegram-profiles", async (request, response) => {
        const telegramProfiles = await STORE.getTelegramProfiles();
        response.render("pages/telegram-profiles", {
            data: {
                title: "Telegram Profiles",
                telegramProfiles,
            },
        });
    });
    app.get("/telegram-profiles/:id", async (request, response) => {
        const { id } = request.params;
        if (typeof id !== "string") return;
        const telegramProfile = await STORE.getTelegramProfileByTelegramId(id);
        response.render("pages/telegram-profile", {
            data: {
                title: "Telegram Profiles",
                telegramProfile,
            },
        });
    });
    app.get("/api/bot/launch", launchBot);
    app.get("/api/bot/stop", stopBot);

    // 404
    app.use((request, response) => response.status(404).send("Not found."));

    // Error handler
    app.use(
        (error: any, request: express.Request, response: express.Response) => {
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
