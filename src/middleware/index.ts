import checkIfBlocked from "./check-if-blocked";
import handleMessageCount from "./handle-message-count";
import handleUserData from "./handle-user-data";

/**
 * All middleware functions listed here will be performed in the order they appear in this array.
 */
const MIDDLEWARE_LIST = [handleUserData, checkIfBlocked, handleMessageCount];

export default MIDDLEWARE_LIST;
