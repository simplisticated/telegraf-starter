import { DataSource } from "typeorm";
import { IsolationLevel } from "typeorm/driver/types/IsolationLevel";
import TelegramProfileModel from "../models/telegram-profile";
import DATA_SOURCE from "./data-source";
import { UserState } from "../types/user-state";
import UserModel from "../models/user";
import SessionModel from "../models/session";
import BotModel from "../models/bot";
import LogModel from "../models/log";

export class Store {
    constructor(
        private configuration: {
            dataSource: DataSource;
            preferredIsolationLevel: IsolationLevel;
        }
    ) {}

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

    async getUserByTelegramId(userTelegramId: string, botTelegramId: string) {
        try {
            const user = await this.configuration.dataSource
                .getRepository(UserModel)
                .findOne({
                    where: {
                        telegramProfile: {
                            telegram_id: userTelegramId,
                        },
                        bot: {
                            telegram_id: botTelegramId,
                        },
                    },
                    relations: {
                        telegramProfile: true,
                        bot: true,
                    },
                });
            return user;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async isAdministrator(
        userTelegramId: string,
        botTelegramId: string
    ): Promise<boolean> {
        try {
            const user = await this.getUserByTelegramId(
                userTelegramId,
                botTelegramId
            );
            return user?.is_administrator ?? false;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async setAdministrator(
        userTelegramId: string,
        botTelegramId: string,
        isAdministrator: boolean
    ): Promise<boolean> {
        try {
            return await this.configuration.dataSource.transaction(
                this.configuration.preferredIsolationLevel,
                async manager => {
                    const repository = manager.getRepository(UserModel);
                    const user = await repository.findOne({
                        where: {
                            telegramProfile: {
                                telegram_id: userTelegramId,
                            },
                            bot: {
                                telegram_id: botTelegramId,
                            },
                        },
                        relations: {
                            telegramProfile: true,
                            bot: true,
                        },
                    });
                    if (!user) return false;
                    if (user.is_administrator === isAdministrator) return true;
                    await repository.update(
                        { id: user.id },
                        { is_administrator: isAdministrator }
                    );
                    const updatedUser = await repository.findOneBy({
                        id: user.id,
                    });
                    if (!updatedUser) return false;
                    return updatedUser.is_administrator === isAdministrator;
                }
            );
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async isBlocked(
        userTelegramId: string,
        botTelegramId: string
    ): Promise<boolean> {
        try {
            const user = await this.getUserByTelegramId(
                userTelegramId,
                botTelegramId
            );
            return user?.is_blocked ?? false;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async setBlocked(
        userTelegramId: string,
        botTelegramId: string,
        isBlocked: boolean
    ): Promise<boolean> {
        try {
            return await this.configuration.dataSource.transaction(
                this.configuration.preferredIsolationLevel,
                async manager => {
                    const repository = manager.getRepository(UserModel);
                    const user = await repository.findOne({
                        where: {
                            telegramProfile: {
                                telegram_id: userTelegramId,
                            },
                            bot: {
                                telegram_id: botTelegramId,
                            },
                        },
                        relations: {
                            telegramProfile: true,
                            bot: true,
                        },
                    });
                    if (!user) return false;
                    if (user.is_blocked === isBlocked) return true;
                    await repository.update(
                        { id: user.id },
                        { is_blocked: isBlocked }
                    );
                    const updatedUser = await repository.findOneBy({
                        id: user.id,
                    });
                    if (!updatedUser) return false;
                    return updatedUser.is_blocked === isBlocked;
                }
            );
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async createOrUpdateUser(
        userData: Partial<UserModel>
    ): Promise<UserModel | null> {
        try {
            return await this.configuration.dataSource.transaction(
                this.configuration.preferredIsolationLevel,
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
                        return this.getUserById(existingUser.id);
                    }
                    const user = await repository.save(
                        repository.create(userData)
                    );
                    return this.getUserById(user.id);
                }
            );
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async updateUserState(
        userTelegramId: string,
        botTelegramId: string,
        handler: (previousState: UserState) => Partial<UserState>
    ): Promise<UserModel | null> {
        try {
            return await this.configuration.dataSource.transaction(
                this.configuration.preferredIsolationLevel,
                async manager => {
                    const userRepository = manager.getRepository(UserModel);
                    const user = await userRepository.findOne({
                        where: {
                            telegramProfile: {
                                telegram_id: userTelegramId,
                            },
                            bot: {
                                telegram_id: botTelegramId,
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

    async getBotById(id: number) {
        try {
            const bot = await this.configuration.dataSource
                .getRepository(BotModel)
                .findOne({
                    where: {
                        id,
                    },
                });
            return bot;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getBotByTelegramId(telegramId: string) {
        try {
            const bot = await this.configuration.dataSource
                .getRepository(BotModel)
                .findOne({
                    where: {
                        telegram_id: telegramId,
                    },
                });
            return bot;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async createOrUpdateBot(
        botData: Partial<BotModel>
    ): Promise<BotModel | null> {
        try {
            return await this.configuration.dataSource.transaction(
                this.configuration.preferredIsolationLevel,
                async manager => {
                    if (!botData.telegram_id) {
                        throw new Error("Bot should include telegram_id");
                    }
                    const repository = manager.getRepository(BotModel);
                    const existingBot = await this.getBotByTelegramId(
                        botData.telegram_id
                    );
                    if (existingBot) {
                        await repository.update(
                            { id: existingBot.id },
                            botData
                        );
                        return this.getBotById(existingBot.id);
                    }
                    const bot = await repository.save(
                        repository.create(botData)
                    );
                    return this.getBotById(bot.id);
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
                this.configuration.preferredIsolationLevel,
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
                    const session = await repository.save(
                        repository.create(sessionData)
                    );
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
                this.configuration.preferredIsolationLevel,
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
        telegramId: string
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
                this.configuration.preferredIsolationLevel,
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

    async getLogById(id: number): Promise<LogModel | null> {
        try {
            const user = await this.configuration.dataSource
                .getRepository(LogModel)
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

    async createLog(logData: Partial<LogModel>): Promise<LogModel | null> {
        try {
            return await this.configuration.dataSource.transaction(
                this.configuration.preferredIsolationLevel,
                async manager => {
                    const repository = manager.getRepository(LogModel);
                    const log = await repository.save(
                        repository.create(logData)
                    );
                    return this.getLogById(log.id);
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
    preferredIsolationLevel: "SERIALIZABLE",
});

export default STORE;
