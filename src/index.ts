import "reflect-metadata";
import { start } from "./start-components";

start({
    console: true,
    database: true,
    folderStructure: true,
    bots: true,
    server: true,
    signalHandlers: true,
});
