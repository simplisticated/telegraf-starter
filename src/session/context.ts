import { Scenes } from "telegraf";
import { SessionData } from "./session";

export interface EngineContext extends Scenes.SceneContext<SessionData> {}
