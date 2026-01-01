import http from "http";
import https from "https";

export async function startListening(
    server: http.Server | https.Server,
    configuration: {
        port: number;
    }
): Promise<boolean> {
    return new Promise(resolve => {
        const errorHandler = (err: Error) => {
            console.error("Server failed to start:", err);
            server.removeListener("error", errorHandler);
            resolve(false);
        };
        server.on("error", errorHandler);
        server.listen(configuration.port, () => {
            server.removeListener("error", errorHandler);
            resolve(true);
        });
    });
}
