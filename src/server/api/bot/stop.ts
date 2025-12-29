import { Request, Response } from "express";
import BOT_MANAGER from "../../../bot/common/manager";

export function stopBot(request: Request, response: Response) {
    BOT_MANAGER.stop();
    response.json({
        stopped: true,
    });
}
