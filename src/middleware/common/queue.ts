import { EngineContext } from "../../session/context";
import { INCOMING_TELEGRAM_UPDATE_QUEUE } from "../../tasks/instances";

export default async function queue(
    context: EngineContext,
    next: () => Promise<void>
): Promise<void> {
    const result = await INCOMING_TELEGRAM_UPDATE_QUEUE.addWithErrorHandling(
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
