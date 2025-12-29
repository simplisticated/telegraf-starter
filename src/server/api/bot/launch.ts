import { Request, Response } from "express";
import BOT_MANAGER from "../../../bot/common/manager";

export async function launchBot(request: Request, response: Response) {
    await BOT_MANAGER.launch();
    response.json({
        launched: true,
    });
}
