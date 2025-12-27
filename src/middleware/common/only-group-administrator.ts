import { MiddlewareFn } from "telegraf";
import { EngineContext } from "../../session/context";
import { isGroup, isGroupAdministrator } from "../../app/context";

export default function onlyGroupAdministrator(
    middleware: MiddlewareFn<EngineContext>
): MiddlewareFn<EngineContext> {
    return async (context, next) => {
        if (!isGroup(context)) return next();
        const isAdministrator = await isGroupAdministrator(context);
        if (!isAdministrator) return next();
        return middleware(context, next);
    };
}
