import { MiddlewareFn } from "telegraf";
import { EngineContext } from "../../session/context";

/**
 * Запускает middleware, переданный в качестве параметра,
 * только если ID бота совпадает с заданным.
 * @param id ID бота, для которого требуется запустить middleware.
 * @param middleware Функция, выполняемая только для бота с заданным ID.
 * @returns Middleware.
 */
export default function onlyBotId(
    id: number,
    middleware: MiddlewareFn<EngineContext>
): MiddlewareFn<EngineContext> {
    return (context, next) => {
        if (context.botInfo.id !== id) return next();
        return middleware(context, next);
    };
}
