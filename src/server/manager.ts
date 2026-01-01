import http from "http";
import https from "https";

class ServerManager {
    private instances: ServerInstance[] = [];

    private closeTask?: Promise<boolean[]>;

    add(id: string, server: Server) {
        const idExists =
            this.instances.find(instance => instance.id === id) !== undefined;
        if (idExists) {
            throw new Error(`Server with ID ${id} has been already added`);
        }
        this.instances.push({
            id,
            server,
        });
    }

    getAll(): ServerInstance[] {
        return Array.from(this.instances);
    }

    get(id: string): ServerInstance | null {
        return this.instances.find(instance => instance.id === id) ?? null;
    }

    async launch(
        id: string,
        configuration: {
            port: number;
        }
    ): Promise<boolean> {
        const server = this.get(id)?.server;
        if (!server || server.listening) return false;
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

    private async _close(): Promise<boolean[]> {
        const results = await Promise.allSettled(
            this.instances
                .filter(instance => instance.server.listening)
                .map(
                    instance =>
                        new Promise<void>((resolve, reject) => {
                            instance.server.closeAllConnections();
                            instance.server.close(error => {
                                if (error) reject();
                                else resolve();
                            });
                        })
                )
        );
        return results.map(result => result.status === "fulfilled");
    }

    async close(): Promise<boolean[]> {
        if (this.closeTask) return this.closeTask;
        const task = this._close();
        this.closeTask = task;
        const result = await task;
        this.closeTask = undefined;
        return result;
    }
}

type Server = http.Server | https.Server;

interface ServerInstance {
    id: string;
    server: http.Server | https.Server;
}

const SERVER_MANAGER = new ServerManager();
export default SERVER_MANAGER;
