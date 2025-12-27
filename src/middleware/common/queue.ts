import { EngineContext } from "../../session/context";
import { INCOMING_TELEGRAM_UPDATE_QUEUE } from "../../tasks/instances";

export default function queue(
    context: EngineContext,
    next: () => Promise<void>
): Promise<void> {
    return INCOMING_TELEGRAM_UPDATE_QUEUE.add(next, {
        key: context.from ? `telegram-user-${context.from.id}` : undefined,
        onTimeout: async () => {
            await context.reply(
                `Сервер перегружен. Попробуйте повторить запрос позже.`,
                context.message
                    ? {
                          reply_parameters: {
                              message_id: context.message?.message_id,
                          },
                      }
                    : undefined
            );
        },
    });
}
