import { configDotenv } from "dotenv";
import { env } from "process";

configDotenv();

const ENV = {
    TELEGRAM_TOKEN: env.TELEGRAM_TOKEN,
    APP_ENVIRONMENT: env.APP_ENVIRONMENT,
};

export default ENV;
