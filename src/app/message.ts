import { Message } from "telegraf/typings/core/types/typegram";

export function parseCommand(message: Message): {
    command: string;
    parameters: string[];
} | null {
    if (!("text" in message)) return null;
    if (!message.text.startsWith("/")) return null;

    const [sourceCommand, ...parameters] = message.text.trim().split(/\s+/);
    const command = sourceCommand.slice(1).split("@")[0];
    return {
        command,
        parameters,
    };
}
