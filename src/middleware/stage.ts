import { EngineContext } from "../session/context";
import STAGE from "../scenes";

export default async function stage(
    context: EngineContext,
    next: () => Promise<void>
) {
    const result = STAGE.middleware();
    return result(context, next);
}
