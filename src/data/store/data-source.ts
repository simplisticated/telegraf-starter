import { DataSource } from "typeorm";
import DATABASE_MIGRATIONS from "../migrations";
import DATABASE_MODELS from "../models";
import { DATABASE_QUEUE } from "../../tasks/instances";
import overrideObjectMethod from "../../tasks/override";
import PATH from "../../app/path";

const DATA_SOURCE = new DataSource({
    type: "sqlite",
    database: PATH.database(),
    synchronize: false,
    logging: false,
    entities: DATABASE_MODELS,
    migrations: DATABASE_MIGRATIONS,
    migrationsRun: false,
    migrationsTableName: "DatabaseMigrations",
    subscribers: [],
    enableWAL: true,
});

overrideObjectMethod(DATA_SOURCE, "transaction", async (source, ...args) =>
    DATABASE_QUEUE.add(async () => source(...args))
);

export default DATA_SOURCE;
