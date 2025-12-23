export type UserState = {
    messageCount: number;
    latestMessageTimestamp?: number;
};

export function createUserState(): UserState {
    return {
        messageCount: 0,
    };
}
