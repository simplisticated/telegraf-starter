import handleMessageCount from "./handle-message-count";
import handleUser from "./handle-user";

/**
 * All middleware functions listed here will be performed in the order they appear in this array.
 */
const MIDDLEWARE_LIST = [handleUser, handleMessageCount];

export default MIDDLEWARE_LIST;
