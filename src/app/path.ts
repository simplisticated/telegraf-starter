import path from "path";
import { CURRENT_ENVIRONMENT } from "./environment";

const PATH = {
    dataFolder() {
        return path.resolve("data", CURRENT_ENVIRONMENT);
    },
    database() {
        return path.resolve(this.dataFolder(), "database.sqlite");
    },
};

export default PATH;
