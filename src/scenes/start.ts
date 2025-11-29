import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { EngineContext } from "../session/context";
import { OUTGOING_MESSAGE_QUEUE } from "../tasks/instances";
import { handleCommandWithActiveScene } from "../middleware/handle-command";

export const START_SCENE_ID = "start-scene";

const START_SCENE = new Scenes.BaseScene<EngineContext>(START_SCENE_ID);
START_SCENE.use(handleCommandWithActiveScene);
START_SCENE.enter(async (context, next) => {
    await OUTGOING_MESSAGE_QUEUE.add(() => context.reply("Hello!"));
    await next();
});
START_SCENE.on(message(), async (context, next) => {
    await OUTGOING_MESSAGE_QUEUE.add(() =>
        context.reply("Message received", {
            reply_to_message_id: context.message.message_id,
        })
    );
    await next();
});
export default START_SCENE;
