import { Request, Response } from "express";

export function main(request: Request, response: Response) {
    response.send("Hello");
}
