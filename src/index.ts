import "reflect-metadata";
import { getDuration } from "./tasks/wait";
import { initializeBots } from "./start-components/bot";
import { initializeConsole } from "./start-components/console";
import { initializeDatabase } from "./start-components/database";
import { initializeFolderStructure } from "./start-components/folder-structure";
import { initializeServer } from "./start-components/server";
import { setupSignalHandlers } from "./start-components/signal-handlers";

async function start(): Promise<boolean> {
    const duration = await getDuration(async () => {
        initializeConsole();
        await initializeDatabase();
        initializeFolderStructure();
        await initializeBots();
        await initializeServer();
        setupSignalHandlers();
    });
    console.log(
        `Launched everything in ${(duration / 1000).toFixed(3)} seconds`
    );
    return true;
}

start();
