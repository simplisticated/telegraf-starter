import { Store } from "../data/store/store";

export class SessionStore {
    constructor(
        public readonly configuration: {
            dataStore: Store;
        }
    ) {}

    async get(key: string) {
        const session =
            await this.configuration.dataStore.getSessionBySessionId(key);
        return session?.state;
    }

    async set(key: string, value: any) {
        await this.configuration.dataStore.createOrUpdateSession({
            session_id: key,
            state: value,
        });
    }

    async delete(key: string) {
        await this.configuration.dataStore.removeSession(key);
    }
}
