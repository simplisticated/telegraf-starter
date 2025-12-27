import http from "http";
import https from "https";
import { createServer } from "./create";

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

export async function launchServer(configuration: {
    port: number;
    useHttps: boolean;
}): Promise<boolean> {
    const server = await createServer({
        useHttps: configuration.useHttps,
    });
    server.addListener("error", console.error);
    return startListening(server, configuration.port);
}
