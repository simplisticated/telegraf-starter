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

    // Here you can implement sending user information to the backend or database.

    next();
}
