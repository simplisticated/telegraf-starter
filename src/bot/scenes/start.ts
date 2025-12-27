import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import privateCommand from "../middleware/private/private-command";
import { EngineContext } from "../session/context";

export const START_SCENE_ID = "start-scene";

const START_SCENE = new Scenes.BaseScene<EngineContext>(START_SCENE_ID);
START_SCENE.use(privateCommand);
START_SCENE.enter(async context => {
    await context.reply("Hello!");
});
START_SCENE.on(message(), async context => {
    await context.reply("Message received", {
        reply_parameters: {
            message_id: context.message.message_id,
        },
    });
});
export default START_SCENE;
