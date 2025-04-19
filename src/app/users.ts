import { User } from "telegraf/typings/core/types/typegram";

export function getUserDescription(user: User): string {
    const username = user.username ?? "";
    const firstName = user.first_name ?? "";
    const lastName = user.last_name ?? "";

    return [
        firstName.length > 0 ? firstName : null,
        lastName.length > 0 ? lastName : null,
        username.length > 0 ? `@${username}` : null,
        `(ID ${user.id})`,
    ]
        .filter(value => value !== null)
        .join(" ");
}
