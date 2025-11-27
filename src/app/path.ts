import path from "path";
import ENV from "./env";

const PATH = {
    dataFolder() {
        return path.resolve("data", ENV.APP_ENVIRONMENT);
    },
    database() {
        return path.resolve(this.dataFolder(), "database.sqlite");
    },
};

export default PATH;
