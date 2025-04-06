import { Context, NarrowedContext } from "telegraf";
import { Update, Message } from "telegraf/typings/core/types/typegram";

export default async function handleTextMessage(
    context: NarrowedContext<
        Context<Update>,
        Update.MessageUpdate<Message.TextMessage>
    >
) {
    // Implement handler for text messages here.
    console.log(context.message.text);
}
