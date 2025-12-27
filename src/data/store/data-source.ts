import { DataSource } from "typeorm";
import DATABASE_MIGRATIONS from "../migrations";
import DATABASE_MODELS from "../models";
import { DATABASE_QUEUE } from "../../tasks/instances";
import overrideObjectMethod from "../../tasks/override";
import ENV from "../../app/env";

const DATA_SOURCE = new DataSource({
    type: "postgres",
    database: ENV.DATABASE.NAME,
    host: ENV.DATABASE.HOST,
    port: ENV.DATABASE.PORT,
    username: ENV.DATABASE.USERNAME,
    password: ENV.DATABASE.PASSWORD,
    synchronize: false,
    logging: false,
    entities: DATABASE_MODELS,
    migrations: DATABASE_MIGRATIONS,
    migrationsRun: false,
    migrationsTableName: "DatabaseMigrations",
    subscribers: [],
});

overrideObjectMethod(DATA_SOURCE, "transaction", async (source, ...args) =>
    DATABASE_QUEUE.add(async () => source(...args))
);

export default DATA_SOURCE;
