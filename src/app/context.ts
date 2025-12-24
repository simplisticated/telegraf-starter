import { Context } from "telegraf";

export function isPrivate(context: Context) {
    return context.chat?.type === "private";
}

export function isGroup(context: Context) {
    return (
        context.chat?.type === "group" || context.chat?.type === "supergroup"
    );
}
