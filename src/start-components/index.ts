import { getDuration } from "../tasks/wait";
import { initializeBots } from "./bot";
import { initializeConsole } from "./console";
import { initializeDatabase } from "./database";
import { initializeFolderStructure } from "./folder-structure";
import { initializeServer } from "./server";
import { setupSignalHandlers } from "./signal-handlers";

interface StartConfiguration {
    console: boolean;
    database: boolean;
    folderStructure: boolean;
    bots: boolean;
    server: boolean;
    signalHandlers: boolean;
}

const USE_ALL_COMPONENTS: StartConfiguration = {
    console: true,
    database: true,
    folderStructure: true,
    bots: true,
    server: true,
    signalHandlers: true,
};

export async function start(
    configuration: StartConfiguration = USE_ALL_COMPONENTS
): Promise<boolean> {
    const duration = await getDuration(async () => {
        if (configuration?.console) {
            initializeConsole();
        }
        if (configuration?.database) {
            await initializeDatabase();
        }
        if (configuration?.folderStructure) {
            await initializeFolderStructure();
        }
        if (configuration?.bots) {
            await initializeBots();
        }
        if (configuration?.server) {
            await initializeServer();
        }
        if (configuration?.signalHandlers) {
            setupSignalHandlers();
        }
    });
    console.log(
        `Launched everything in ${(duration / 1000).toFixed(3)} seconds`
    );
    return true;
}
