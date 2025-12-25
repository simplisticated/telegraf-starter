export type UserState = {
    privateMessageCount: number;
};

export function createUserState(): UserState {
    return {
        privateMessageCount: 0,
    };
}
