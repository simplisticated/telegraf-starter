import { DataSource } from "typeorm";
import DATABASE_MIGRATIONS from "../migrations";
import DATABASE_MODELS from "../models";
import overrideObjectMethod from "../../tasks/override";
import PATH from "../../app/path";
import { QUEUE_INSTANCES } from "../../tasks/instances";

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
});

overrideObjectMethod(DATA_SOURCE, "transaction", (source, ...parameters) =>
    QUEUE_INSTANCES.database.add(() => source(...parameters))
);

export default DATA_SOURCE;
