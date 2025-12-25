import STORE from "../../data/store/store";
import { EngineContext } from "../../session/context";

export default async function botData(
    context: EngineContext,
    next: () => Promise<void>
) {
    const bot = context.botInfo;
    await STORE.createOrUpdateBot({
        telegram_id: bot.id,
        username: bot.username,
        can_join_groups: bot.can_join_groups,
        can_read_all_group_messages: bot.can_read_all_group_messages,
        supports_inline_queries: bot.supports_inline_queries,
    });
    return next();
}
