import { session } from "telegraf";
import STORE from "../data/store/store";
import { SessionStore } from "../session/store";
import { EngineContext } from "../session/context";

export default async function setupSession(
    context: EngineContext,
    next: () => Promise<void>
) {
    const result = session({
        store: new SessionStore({ dataStore: STORE }),
        getSessionKey: c => {
            if (!c.from || !c.chat) return undefined;
            return `${c.from.id}:${c.chat.id}`;
        },
    });
    return result(context, next);
}
