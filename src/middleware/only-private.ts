import { MiddlewareFn } from "telegraf";
import { isPrivate } from "../app/context";
import { EngineContext } from "../session/context";

export default function onlyPrivate(
    middleware: MiddlewareFn<EngineContext>
): MiddlewareFn<EngineContext> {
    return (context, next) => {
        if (!isPrivate(context)) return next();
        return middleware(context, next);
    };
}
