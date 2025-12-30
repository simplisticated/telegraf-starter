import { Request, Response } from "express";
import BOT_MANAGER from "../../../bot/common/manager";

export async function launchBot(request: Request, response: Response) {
    const { id } = request.query;
    if (typeof id !== "string") {
        response.status(400).send("Wrong request");
        return;
    }

    const result = await BOT_MANAGER.launch(id);
    response.json({
        launched: result.map(botId => {
            const instance = BOT_MANAGER.get(botId);
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
