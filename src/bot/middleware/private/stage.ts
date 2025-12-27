import { EngineContext } from "../../session/context";
import STAGE from "../../scenes";
import { isPrivate } from "../../common/context";

export default function stage(
    context: EngineContext,
    next: () => Promise<void>
) {
    if (!isPrivate(context)) return next();
    const result = STAGE.middleware();
    return result(context, next);
}
