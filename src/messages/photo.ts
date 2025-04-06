import { Context, NarrowedContext } from "telegraf";
import { Update, Message } from "telegraf/typings/core/types/typegram";

export default async function handlePhotoMessage(
    context: NarrowedContext<
        Context<Update>,
        Update.MessageUpdate<Message.PhotoMessage>
    >
) {
    // Implement handler for photo messages here.
    console.log(context.message.photo.length);
}
