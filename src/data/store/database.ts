import UserModel from "../models/user";
import DATA_SOURCE from "./data-source";

const DATABASE = {
    async initialize() {
        try {
            await DATA_SOURCE.initialize();
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    },

    async getTelegramUserByIdentifier(
        identifier: number
    ): Promise<UserModel | null> {
        try {
            return DATA_SOURCE.getRepository(UserModel).findOne({
                where: {
                    id: identifier,
                },
            });
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    async getTelegramUserByTelegramIdentifier(
        telegramIdentifier: number
    ): Promise<UserModel | null> {
        try {
            return DATA_SOURCE.getRepository(UserModel).findOne({
                where: {
                    telegram_id: telegramIdentifier,
                },
            });
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    async createOrUpdateTelegramUser(
        data: Partial<UserModel>
    ): Promise<UserModel | null> {
        if (!data.telegram_id) return null;
        const existingUser = await this.getTelegramUserByTelegramIdentifier(
            data.telegram_id
        );
        try {
            if (existingUser) {
                await DATA_SOURCE.getRepository(UserModel).update(
                    { id: existingUser.id },
                    { ...data, modification_date: new Date() }
                );
                return this.getTelegramUserByIdentifier(existingUser.id);
            }
            const user = {
                ...data,
                creation_date: new Date(),
            };
            return DATA_SOURCE.getRepository(UserModel).save(user);
        } catch (error) {
            console.error(error);
            return null;
        }
    },
};

export default DATABASE;
