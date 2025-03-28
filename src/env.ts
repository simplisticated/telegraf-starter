import { configDotenv } from "dotenv";
import { env } from "process";

configDotenv();

const ENV = {
    TELEGRAM_TOKEN: env.TELEGRAM_TOKEN,
};

export default ENV;
