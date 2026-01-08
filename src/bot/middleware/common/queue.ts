import { QUEUE_INSTANCES } from "../../../tasks/instances";
import { EngineContext } from "../../session/context";

export default async function queue(
    context: EngineContext,
    next: () => Promise<void>
): Promise<void> {
    const result =
        await QUEUE_INSTANCES.incomingTelegramUpdate.addWithErrorHandling(
            next,
            context.from ? `telegram-user-${context.from.id}` : undefined
        );
    if (result.isTimedOut) {
        await context.reply(
            `Сервер перегружен. Попробуйте повторить запрос позже.`,
            {
                ...(context.message !== undefined
                    ? {
                          reply_parameters: {
                              message_id: context.message.message_id,
                          },
                      }
                    : undefined),
            }
        );
    }
}
