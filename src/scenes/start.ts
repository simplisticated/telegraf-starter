import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import Context from "../session/context";

export const START_SCENE_ID = "start-scene";

const START_SCENE = new Scenes.BaseScene<Context>(START_SCENE_ID);
START_SCENE.enter(context => context.reply("Hello!"));
START_SCENE.on(message("text"), async context => {
    console.log(context.message.text);
});
export default START_SCENE;
