import express from "express";

export function getClientIpAddress(
    request: express.Request
): string | undefined {
    return (
        request.socket.remoteAddress ??
        request.ip ??
        request.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim()
    )?.replace(/^::ffff:/, "");
}
