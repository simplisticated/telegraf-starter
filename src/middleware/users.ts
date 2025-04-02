import { Context } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";

export default function handleUser(
    context: Context<Update>,
    next: () => Promise<void>
) {
    const sender = context.from;
    if (!sender) {
        next();
        return;
    }

    next();
}
