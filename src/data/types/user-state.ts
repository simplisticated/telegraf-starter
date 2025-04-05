export type UserState = {
    messageCount: number;
};

export function createUserState(): UserState {
    return {
        messageCount: 0,
    };
}
