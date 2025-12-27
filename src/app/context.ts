import { Context } from "telegraf";

export function isPrivate(context: Context) {
    return context.chat?.type === "private";
}

export function isGroup(context: Context) {
    return (
        context.chat?.type === "group" || context.chat?.type === "supergroup"
    );
}

export async function getGroupAdministratorIdentifiers(
    context: Context
): Promise<number[]> {
    if (!isGroup(context)) return [];
    const administrators = await context.getChatAdministrators();
    return administrators.map(administrator => administrator.user.id);
}

export async function isGroupAdministrator(context: Context): Promise<boolean> {
    if (!isGroup(context)) return false;
    if (!context.from) return false;
    const administrators = await context.getChatAdministrators();
    return administrators
        .map(administrator => administrator.user.id)
        .includes(context.from.id);
}
