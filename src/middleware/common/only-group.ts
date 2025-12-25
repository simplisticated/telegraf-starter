import { MiddlewareFn } from "telegraf";
import { isGroup } from "../../app/context";
import { EngineContext } from "../../session/context";

export default function onlyGroup(
    middleware: MiddlewareFn<EngineContext>
): MiddlewareFn<EngineContext> {
    return (context, next) => {
        if (!isGroup(context)) return next();
        return middleware(context, next);
    };
}
