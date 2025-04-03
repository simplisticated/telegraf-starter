import TelegramUserModel from "../models/telegram-user";
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
    ): Promise<TelegramUserModel | null> {
        try {
            return DATA_SOURCE.getRepository(TelegramUserModel).findOne({
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
    ): Promise<TelegramUserModel | null> {
        try {
            return DATA_SOURCE.getRepository(TelegramUserModel).findOne({
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
        data: Partial<TelegramUserModel>
    ): Promise<TelegramUserModel | null> {
        if (!data.telegram_id) return null;
        const existingUser = await this.getTelegramUserByTelegramIdentifier(
            data.telegram_id
        );
        try {
            if (existingUser) {
                await DATA_SOURCE.getRepository(TelegramUserModel).update(
                    { id: existingUser.id },
                    { ...data, modification_date: new Date() }
                );
                return this.getTelegramUserByIdentifier(existingUser.id);
            }
            const user = {
                ...data,
                creation_date: new Date(),
            };
            return DATA_SOURCE.getRepository(TelegramUserModel).save(user);
        } catch (error) {
            console.error(error);
            return null;
        }
    },
};

export default DATABASE;
