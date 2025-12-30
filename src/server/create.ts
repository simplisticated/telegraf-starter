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
import { getClientIpAddress } from "../app/ip-address";

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
                getClientIpAddress(request),
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
    app.get("/", async (request, response) => {
        response.render("pages/dashboard", {
            data: {
                title: "Admin Panel",
                telegramProfiles: {
                    count: (await STORE.getTelegramProfilesCount()) ?? 0,
                    active: {
                        day: await STORE.getActiveTelegramProfilesCount(1),
                        week: await STORE.getActiveTelegramProfilesCount(7),
                        month: await STORE.getActiveTelegramProfilesCount(30),
                    },
                },
            },
        });
    });
    app.get("/users", async (request, response) => {
        const telegramProfiles = await STORE.getTelegramProfiles();
        telegramProfiles.sort(
            (left, right) =>
                (right.updated ?? right.created).getTime() -
                (left.updated ?? left.created).getTime()
        );
        response.render("pages/telegram-profiles/list", {
            data: {
                title: "Users",
                telegramProfiles,
            },
        });
    });
    app.get("/users/:id", async (request, response) => {
        const { id } = request.params;
        const telegramProfile =
            typeof id === "string"
                ? await STORE.getTelegramProfileByTelegramId(id)
                : null;
        response.render("pages/telegram-profiles/id", {
            data: {
                title: `User ${id}`,
                telegramProfile,
            },
        });
    });
    app.get("/api/bot/launch", launchBot);
    app.get("/api/bot/launch/:id", launchBot);
    app.get("/api/bot/launch/:username", launchBot);
    app.get("/api/bot/stop", stopBot);
    app.get("/api/bot/stop/:id", stopBot);
    app.get("/api/bot/stop/:username", stopBot);

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
