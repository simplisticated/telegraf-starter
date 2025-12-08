import { SessionManager } from "@simplisticated/telegraf-stored-session";
import { EngineContext } from "../session/context";
import PATH from "../app/path";

export const SESSION_MANAGER = new SessionManager({
    type: "sqlite",
    database: PATH.sessionDatabase(),
});

export default async function setupSession(
    context: EngineContext,
    next: () => Promise<void>
) {
    await SESSION_MANAGER.initialize();
    return SESSION_MANAGER.middleware(context, next);
}
