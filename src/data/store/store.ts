import { DataSource } from "typeorm";
import TelegramProfileModel from "../models/telegram-profile";
import DATA_SOURCE from "./data-source";
import { UserState } from "../types/user-state";
import UserModel from "../models/user";
import SessionModel from "../models/session";

export class Store {
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

    async isAdministrator(telegramId: number): Promise<boolean> {
        try {
            const user = await this.getUserByTelegramId(telegramId);
            return user?.is_administrator ?? false;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async isBlocked(telegramId: number): Promise<boolean> {
        try {
            const user = await this.getUserByTelegramId(telegramId);
            return user?.is_blocked ?? false;
        } catch (error) {
            console.error(error);
            return false;
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
                            userData
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
                    const user = await repository.save(userData);
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
                    const userRepository = manager.getRepository(UserModel);
                    const user = await userRepository.findOne({
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
                    await userRepository.update(
                        { id: user.id },
                        { state: updatedState }
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

    async getSessionBySessionId(id: string) {
        try {
            const session = await this.configuration.dataSource
                .getRepository(SessionModel)
                .findOne({
                    where: {
                        session_id: id,
                    },
                });
            return session;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async createOrUpdateSession(
        sessionData: Partial<SessionModel>
    ): Promise<SessionModel | null> {
        try {
            return await this.configuration.dataSource.transaction(
                "SERIALIZABLE",
                async manager => {
                    if (!sessionData.session_id) {
                        throw new Error("Session should include session_id");
                    }
                    const repository = manager.getRepository(SessionModel);
                    const existingSession = await this.getSessionBySessionId(
                        sessionData.session_id
                    );
                    if (existingSession) {
                        await repository.update(
                            { id: existingSession.id },
                            sessionData
                        );
                        return this.getSessionBySessionId(
                            sessionData.session_id
                        );
                    }
                    const session = await repository.save(sessionData);
                    if (!session) return null;
                    const updatedSession = await this.getSessionBySessionId(
                        session.session_id
                    );
                    return updatedSession;
                }
            );
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async removeSession(sessionId: string): Promise<boolean> {
        try {
            return await this.configuration.dataSource.transaction(
                "SERIALIZABLE",
                async manager => {
                    const repository = manager.getRepository(SessionModel);
                    await repository.delete({
                        session_id: sessionId,
                    });
                    const session = await this.getSessionBySessionId(sessionId);
                    return session === null;
                }
            );
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async getTelegramProfileById(
        id: number
    ): Promise<TelegramProfileModel | null> {
        try {
            const telegramProfile = await this.configuration.dataSource
                .getRepository(TelegramProfileModel)
                .findOne({ where: { id } });
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
                .findOne({ where: { telegram_id: telegramId } });
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
                            telegramProfileData
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
                    const telegramProfile =
                        await repository.save(telegramProfileData);
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

                    const user = await userRepository.save({});
                    await telegramProfileRepository.save({
                        ...telegramProfileData,
                        user,
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
