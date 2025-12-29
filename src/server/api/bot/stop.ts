import { Request, Response } from "express";
import BOT_MANAGER from "../../../bot/common/manager";

export function stopBot(request: Request, response: Response) {
    const result = BOT_MANAGER.stop();
    response.json({
        stopped: result.map(id => {
            const instance = BOT_MANAGER.get(id);
            return {
                id: instance?.bot.botInfo?.id.toString() ?? null,
                username: instance?.bot.botInfo?.username ?? null,
            };
        }),
        active: BOT_MANAGER.getAll()
            .filter(instance => instance.state.isActive)
            .map(instance => ({
                id: instance.bot.botInfo?.id.toString() ?? null,
                username: instance.bot.botInfo?.username ?? null,
            })),
    });
}
