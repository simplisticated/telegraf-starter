import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { EngineContext } from "../session/context";
import { privateCommandWithActiveScene } from "../middleware/private/private-command";

export const START_SCENE_ID = "start-scene";

const START_SCENE = new Scenes.BaseScene<EngineContext>(START_SCENE_ID);
START_SCENE.use(privateCommandWithActiveScene);
START_SCENE.enter(async (context, next) => {
    await context.reply("Hello!");
    await next();
});
START_SCENE.on(message(), async (context, next) => {
    await context.reply("Message received", {
        reply_parameters: {
            message_id: context.message.message_id,
        },
    });
    await next();
});
export default START_SCENE;
