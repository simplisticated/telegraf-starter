import { Scenes } from "telegraf";
import START_SCENE from "./start";
import { EngineContext } from "../session/context";

const STAGE = new Scenes.Stage<EngineContext>([START_SCENE]);
export default STAGE;
