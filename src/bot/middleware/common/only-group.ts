import { MiddlewareFn } from "telegraf";
import { EngineContext } from "../../session/context";
import { isGroup } from "../../common/context";

export default function onlyGroup(
    middleware: MiddlewareFn<EngineContext>
): MiddlewareFn<EngineContext> {
    return (context, next) => {
        if (!isGroup(context)) return next();
        return middleware(context, next);
    };
}
