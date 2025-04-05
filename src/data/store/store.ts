import { DataSource } from "typeorm";
import TelegramProfileModel from "../models/telegram-profile";
import DATA_SOURCE from "./data-source";
import { UserState } from "../types/user-state";
import UserModel from "../models/user";

class Store {
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

    async getUserById(id: number) {
        try {
            const user = await this.configuration.dataSource
                .getRepository(UserModel)
                .findOne({
                    where: {
                        id,
                    },
                    relations: {
                        telegramProfile: true,
                    },
                });
            return user;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getUserByTelegramId(telegramId: number) {
        try {
            const user = await this.configuration.dataSource
                .getRepository(UserModel)
                .findOne({
                    where: {
                        telegramProfile: {
                            telegram_id: telegramId,
                        },
                    },
                    relations: {
                        telegramProfile: true,
                    },
                });
            return user;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async createOrUpdateUser(
        userData: Partial<UserModel>
    ): Promise<{ user: UserModel; isNewUser: boolean } | null> {
        try {
            return await this.configuration.dataSource.transaction(
                "SERIALIZABLE",
                async manager => {
                    const repository = manager.getRepository(UserModel);
                    const existingUser = userData.id
                        ? await repository.findOne({
                              where: { id: userData.id },
                          })
                        : null;
                    if (existingUser) {
                        await repository.update(
                            { id: existingUser.id },
                            { ...userData, modification_date: new Date() }
                        );
                        const updatedUser = await this.getUserById(
                            existingUser.id
                        );
                        return updatedUser
                            ? {
                                  user: updatedUser,
                                  isNewUser: false,
                              }
                            : null;
                    }
                    const resultUserData: Partial<UserModel> = {
                        ...userData,
                        creation_date: new Date(),
                    };
                    const user = await repository.save(resultUserData);

                    const updatedUser = await this.getUserById(user.id);
                    return updatedUser
                        ? {
                              user: updatedUser,
                              isNewUser: true,
                          }
                        : null;
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
                    const user = await manager
                        .getRepository(UserModel)
                        .findOne({
                            where: {
                                telegramProfile: {
                                    telegram_id: telegramId,
                                },
                            },
                        });
                    if (!user) return null;
                    const updatedState: UserState = {
                        ...user.state,
                        ...handler(user.state),
                    };
                    await manager.getRepository(UserModel).update(
                        { id: user.id },
                        {
                            state: updatedState,
                            modification_date: new Date(),
                        }
                    );
                    const updatedUser = await this.getUserById(user.id);
                    return updatedUser;
                }
            );
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getTelegramProfileById(
        id: number
    ): Promise<TelegramProfileModel | null> {
        try {
            const telegramProfile = await this.configuration.dataSource
                .getRepository(TelegramProfileModel)
                .findOne({
                    where: {
                        id,
                    },
                });
            return telegramProfile;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getTelegramProfileByTelegramId(
        telegramId: number
    ): Promise<TelegramProfileModel | null> {
        try {
            const telegramProfile = await this.configuration.dataSource
                .getRepository(TelegramProfileModel)
                .findOne({
                    where: {
                        telegram_id: telegramId,
                    },
                });
            return telegramProfile;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async createOrUpdateTelegramProfile(
        telegramProfileData: Partial<TelegramProfileModel>
    ): Promise<{
        telegramProfile: TelegramProfileModel;
        isNewTelegramProfile: boolean;
    } | null> {
        try {
            return await this.configuration.dataSource.transaction(
                "SERIALIZABLE",
                async manager => {
                    if (!telegramProfileData.telegram_id) {
                        throw new Error(
                            "Telegram profile should include telegram_id"
                        );
                    }
                    const repository =
                        manager.getRepository(TelegramProfileModel);
                    const existingTelegramProfile =
                        await this.getTelegramProfileByTelegramId(
                            telegramProfileData.telegram_id
                        );
                    if (existingTelegramProfile) {
                        await repository.update(
                            { id: existingTelegramProfile.id },
                            {
                                ...telegramProfileData,
                                modification_date: new Date(),
                            }
                        );
                        const telegramProfile =
                            await this.getTelegramProfileById(
                                existingTelegramProfile.id
                            );
                        return telegramProfile
                            ? {
                                  telegramProfile,
                                  isNewTelegramProfile: false,
                              }
                            : null;
                    }
                    const resultTelegramProfileData: Partial<TelegramProfileModel> =
                        {
                            ...telegramProfileData,
                            creation_date: new Date(),
                        };
                    const telegramProfile = await repository.save(
                        resultTelegramProfileData
                    );

                    const updatedTelegramProfile =
                        await this.getTelegramProfileById(telegramProfile.id);
                    return updatedTelegramProfile
                        ? {
                              telegramProfile,
                              isNewTelegramProfile: true,
                          }
                        : null;
                }
            );
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async createOrUpdateUserWithTelegramProfile(
        telegramProfileData: Partial<TelegramProfileModel>
    ): Promise<{ user: UserModel; isNewUser: boolean } | null> {
        try {
            return await this.configuration.dataSource.transaction(
                "SERIALIZABLE",
                async manager => {
                    if (!telegramProfileData.telegram_id) {
                        throw new Error(
                            "Telegram profile should include telegram_id"
                        );
                    }

                    const userRepository = manager.getRepository(UserModel);
                    const telegramProfileRepository =
                        manager.getRepository(TelegramProfileModel);

                    const existingUser = await this.getUserByTelegramId(
                        telegramProfileData.telegram_id
                    );

                    if (existingUser) {
                        const existingTelegramProfile =
                            existingUser.telegramProfile!;
                        await telegramProfileRepository.update(
                            { id: existingTelegramProfile.id },
                            {
                                ...existingTelegramProfile,
                                ...telegramProfileData,
                                modification_date: new Date(),
                            }
                        );
                        const updatedUser = await this.getUserById(
                            existingUser.id
                        );
                        return updatedUser
                            ? {
                                  user: updatedUser,
                                  isNewUser: false,
                              }
                            : null;
                    }

                    const user = await userRepository.save({
                        creation_date: new Date(),
                    });
                    await telegramProfileRepository.save({
                        ...telegramProfileData,
                        user,
                        creation_date: new Date(),
                    });

                    const updatedUser = await this.getUserById(user.id);
                    return updatedUser
                        ? {
                              user: updatedUser,
                              isNewUser: true,
                          }
                        : null;
                }
            );
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}

const STORE = new Store({
    dataSource: DATA_SOURCE,
});

export default STORE;
