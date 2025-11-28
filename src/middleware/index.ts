import checkIfBlocked from "./check-if-blocked";
import command from "./command";
import messageCount from "./message-count";
import userData from "./user-data";

/**
 * All middleware functions listed here will be performed in the order they appear in this array.
 */
export const MIDDLEWARE_LIST = [
    userData,
    messageCount,
    checkIfBlocked,
    command,
];
