export type LogLevel = "log" | "error";

export function setupConsole(configuration: {
    outputTimestamp: boolean;
    timezone?: string;
    handleMessage?: (message: string | undefined, level: LogLevel) => void;
}) {
    const { log, error } = console;
    const getFormattedDate = () => {
        const currentDate = new Date();
        const options: Intl.DateTimeFormatOptions = {
            timeZone: configuration.timezone,
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
        };
        const formatter = new Intl.DateTimeFormat(undefined, options);
        return formatter.format(currentDate);
    };
    const getResultMessage = (message?: any, ...parameters: any[]) => {
        if (message === undefined && parameters.length === 0) {
            return undefined;
        }
        return [message, ...parameters].map(value => `${value}`).join(" ");
    };
    const getColor = (level: LogLevel) => {
        switch (level) {
            case "log":
                return undefined;
            case "error":
                return "\x1b[35m";
            default:
                return undefined;
        }
    };
    const getLogMethod = (level: LogLevel) => {
        switch (level) {
            case "log":
                return log;
            case "error":
                return error;
            default:
                return undefined;
        }
    };
    const output = (level: LogLevel, message?: any, ...parameters: any[]) => {
        const color = getColor(level);
        if (color) {
            log(color);
        }

        if (configuration.outputTimestamp) {
            log(getFormattedDate());
        }

        const resultMessage = getResultMessage(message, parameters);

        const logMethod = getLogMethod(level);
        if (logMethod) {
            logMethod(resultMessage);
        }

        log("\x1b[0m");

        if (configuration.handleMessage) {
            configuration.handleMessage(resultMessage, level);
        }
    };
    console.log = (message?: any, ...parameters: any[]) =>
        output("log", message, parameters);
    console.error = (message?: any, ...parameters: any[]) =>
        output("error", message, parameters);
}
