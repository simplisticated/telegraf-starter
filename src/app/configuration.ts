import { AppEnvironment } from "./app-environment";
import ENV from "./env";

function getAppConfiguration(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    environment: AppEnvironment
) {
    return {
        app: {
            incomingRequestHandlerTimeout: 3600 * 1000,
        },
    };
}

/**
 * Набор гибко изменяемых значений, которые, в отличие от переменных окружения,
 * действуют для всех сборок продукта.
 */
export const APP_CONFIGURATION = getAppConfiguration(ENV.APP_ENVIRONMENT);
