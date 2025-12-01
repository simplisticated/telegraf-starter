import { Scenes } from "telegraf";
import { EngineContext } from "../session/context";
import START_SCENE from "./start";

const STAGE = new Scenes.Stage<EngineContext>([START_SCENE]);
export default STAGE;
