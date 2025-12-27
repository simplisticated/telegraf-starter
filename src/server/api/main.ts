import { Request, Response } from "express";

export function mainEndpoint(request: Request, response: Response) {
    response.send("Hello");
}
