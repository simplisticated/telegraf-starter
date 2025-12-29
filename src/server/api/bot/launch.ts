import { Request, Response } from "express";
import BOT_MANAGER from "../../../bot/common/manager";

export async function launchBot(request: Request, response: Response) {
    const result = await BOT_MANAGER.launch();
    response.json({
        launched: result.map(id => {
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
