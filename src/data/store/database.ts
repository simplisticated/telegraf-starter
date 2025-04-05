import { DataSource } from "typeorm";
import UserModel from "../models/user";
import DATA_SOURCE from "./data-source";
import { UserState } from "../types/user-state";

class Database {
    constructor(private configuration: { dataSource: DataSource }) {}

    async initialize(): Promise<boolean> {
        try {
            await this.configuration.dataSource.initialize();
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async getUserById(id: number): Promise<UserModel | null> {
        try {
            const user = await this.configuration.dataSource
                .getRepository(UserModel)
                .findOne({
                    where: {
                        id,
                    },
                });
            return user;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getUserByTelegramId(telegramId: number): Promise<UserModel | null> {
        try {
            const user = await this.configuration.dataSource
                .getRepository(UserModel)
                .findOne({
                    where: {
                        telegram_id: telegramId,
                    },
                });
            return user;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async createOrUpdateUser(
        data: Partial<UserModel>
    ): Promise<UserModel | null> {
        try {
            return await this.configuration.dataSource.transaction(
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
                    const userData: Partial<UserModel> = {
                        ...data,
                        creation_date: new Date(),
                    };
                    const user = await repository.save(userData);
                    return user;
                }
            );
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async updateUserState(
        telegramId: number,
        handler: (previousState: UserState) => Partial<UserState>
    ): Promise<UserModel | null> {
        try {
            return await this.configuration.dataSource.transaction(
                "SERIALIZABLE",
                async manager => {
                    const user = await this.getUserByTelegramId(telegramId);
                    if (!user) return null;
                    const updatedState: UserState = {
                        ...user.state,
                        ...handler(user.state),
                    };
                    await manager
                        .getRepository(UserModel)
                        .update({ id: user.id }, { state: updatedState });
                    const updatedUser = await this.getUserById(user.id);
                    return updatedUser;
                }
            );
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}

const DATABASE = new Database({
    dataSource: DATA_SOURCE,
});

export default DATABASE;
