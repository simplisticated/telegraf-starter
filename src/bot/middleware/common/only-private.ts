import { MiddlewareFn } from "telegraf";
import { EngineContext } from "../../session/context";
import { isPrivate } from "../../common/context";

export default function onlyPrivate(
    middleware: MiddlewareFn<EngineContext>
): MiddlewareFn<EngineContext> {
    return (context, next) => {
        if (!isPrivate(context)) return next();
        return middleware(context, next);
    };
}
