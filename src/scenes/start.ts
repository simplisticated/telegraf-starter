import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { EngineContext } from "../session/context";
import { MIDDLEWARE_LIST } from "../middleware";

export const START_SCENE_ID = "start-scene";

const START_SCENE = new Scenes.BaseScene<EngineContext>(START_SCENE_ID);
START_SCENE.enter(context => context.reply("Hello!"));
MIDDLEWARE_LIST.forEach(middleware => START_SCENE.use(middleware));
START_SCENE.on(message(), async context => {
    await context.reply("Message received", {
        reply_to_message_id: context.message.message_id,
    });
});
export default START_SCENE;
