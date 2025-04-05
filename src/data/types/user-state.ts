export type UserState = {
    /**
     * How many times the user used `/start` command.
     */
    startCount: number;
};

export function createUserState(): UserState {
    return {
        startCount: 0,
    };
}
