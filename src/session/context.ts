import { Scenes } from "telegraf";
import { SessionData } from "./session";

export default interface Context extends Scenes.SceneContext<SessionData> {}
