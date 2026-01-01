import { getPublicBaseUrl, getLocalBaseUrl } from "../app/base-url";
import ENV from "../app/env";
import { createServer } from "../server/create";
import { startListening } from "../server/launch";
import SERVER_MANAGER from "../server/manager";

export async function initializeServer() {
    console.log(`Starting server`);
    const server = await createServer({
        useHttps: ENV.USE_HTTPS,
    });
    server.addListener("error", console.error);
    const serverLaunched = await startListening(server, {
        port: ENV.SERVER_PORT,
    });
    if (serverLaunched) {
        const publicBaseUrl = getPublicBaseUrl();
        const resultBaseUrl = publicBaseUrl ?? getLocalBaseUrl();
        const isLocal = publicBaseUrl === null;
        const output = [
            `Server is listening on port ${ENV.SERVER_PORT}`,
            "",
            `Administrator panel${
                isLocal ? " (local network)" : ""
            }: ${resultBaseUrl}`,
            "",
            `Stop all bots: ${resultBaseUrl}/api/bot/stop`,
            `Stop bot with ID: ${resultBaseUrl}/api/bot/stop/:id`,
            `Stop bot with username: ${resultBaseUrl}/api/bot/stop/:username`,
            "",
            `Launch all bots: ${resultBaseUrl}/api/bot/launch`,
            `Launch bot with ID: ${resultBaseUrl}/api/bot/launch/:id`,
            `Launch bot with username: ${resultBaseUrl}/api/bot/launch/:username`,
        ].join("\n");
        console.log(output);
    }
    SERVER_MANAGER.add("api", server);
}
