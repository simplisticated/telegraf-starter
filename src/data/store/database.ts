import UserModel, { UserState } from "../models/user";
import DATA_SOURCE from "./data-source";

const DATABASE = {
    async initialize(): Promise<boolean> {
        try {
            await DATA_SOURCE.initialize();
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    },

    async getUserById(id: number): Promise<UserModel | null> {
        try {
            return DATA_SOURCE.getRepository(UserModel).findOne({
                where: {
                    id,
                },
            });
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    async getUserByTelegramId(telegramId: number): Promise<UserModel | null> {
        try {
            return DATA_SOURCE.getRepository(UserModel).findOne({
                where: {
                    telegram_id: telegramId,
                },
            });
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    async createOrUpdateUser(
        data: Partial<UserModel>
    ): Promise<UserModel | null> {
        try {
            return await DATA_SOURCE.transaction(
                "SERIALIZABLE",
                async manager => {
                    if (!data.telegram_id) {
                        throw new Error("User should include telegram_id");
                    }
                    const repository = manager.getRepository(UserModel);
                    const existingUser = await this.getUserByTelegramId(
                        data.telegram_id
                    );
                    if (existingUser) {
                        await repository.update(
                            { id: existingUser.id },
                            { ...data, modification_date: new Date() }
                        );
                        return this.getUserById(existingUser.id);
                    }
                    const user = {
                        ...data,
                        creation_date: new Date(),
                    };
                    return repository.save(user);
                }
            );
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    async updateUserState(
        telegramId: number,
        handler: (previousState: UserState) => Partial<UserState>
    ): Promise<UserModel | null> {
        try {
            return DATA_SOURCE.transaction("SERIALIZABLE", async manager => {
                const user = await this.getUserByTelegramId(telegramId);
                if (!user) return null;
                const updatedState: UserState = {
                    ...user.state,
                    ...handler(user.state),
                };
                await manager
                    .getRepository(UserModel)
                    .update({ id: user.id }, { state: updatedState });
                return this.getUserByTelegramId(telegramId);
            });
        } catch (error) {
            console.error(error);
            return null;
        }
    },
};

export default DATABASE;
