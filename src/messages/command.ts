import { Context, NarrowedContext } from "telegraf";
import { Update, Message } from "telegraf/typings/core/types/typegram";

export default async function handleCommand(
    context: NarrowedContext<
        Context<Update>,
        Update.MessageUpdate<Message.TextMessage>
    > & {
        command: string;
        payload: string;
        args: string[];
    }
) {
    // Implement handler for commands here.

    switch (context.command) {
        case "start": {
            console.log(`/start`);
            break;
        }
        default: {
            break;
        }
    }
}
