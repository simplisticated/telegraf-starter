import { DataSource } from "typeorm";
import PATH from "../../app/path";
import DATABASE_MIGRATIONS from "../migrations";
import DATABASE_MODELS from "../models";

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

export default DATA_SOURCE;
