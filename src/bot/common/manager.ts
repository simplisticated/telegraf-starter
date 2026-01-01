/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
import { Context, Input, Telegraf } from "telegraf";
import { launchBot } from "./launch";
import { EngineContext } from "../session/context";
import STORE from "../../data/store/store";

class BotManager<TelegrafContext extends Context> {
    private botInstances: BotInstance<TelegrafContext>[] = [];

    add(bot: Bot<TelegrafContext> | Bot<TelegrafContext>[]) {
        const getData = (
            value: Bot<TelegrafContext>
        ): BotInstance<TelegrafContext> => ({
            bot: value,
            state: {
                isActive: false,
            },
        });
        if (Array.isArray(bot)) {
            this.botInstances.push(...bot.map(getData));
        } else {
            this.botInstances.push(getData(bot));
        }
    }

    getAll(): BotInstance<TelegrafContext>[] {
        return Array.from(this.botInstances);
    }

    get(id: string): BotInstance<TelegrafContext> | null {
        return (
            this.botInstances.find(
                instance => instance.bot.botInfo?.id.toString() === id
            ) ?? null
        );
    }

    async launch(identifierOrUsername?: string): Promise<string[]> {
        const launched: string[] = [];
        const instancesToLaunch = (() => {
            if (identifierOrUsername) {
                const result = this.botInstances.find(instance => {
                    const botInformation = instance.bot.botInfo;
                    if (!botInformation) return false;
                    return (
                        botInformation.id.toString() === identifierOrUsername ||
                        botInformation.username === identifierOrUsername
                    );
                });
                return result ? [result] : [];
            }
            return this.botInstances.filter(
                instance => !instance.state.isActive
            );
        })();
        await Promise.allSettled(
            instancesToLaunch.map(async instance => {
                const result = await launchBot(instance.bot);
                if (result) {
                    instance.state.isActive = true;
                    launched.push(instance.bot.botInfo?.id.toString() ?? "");
                }
                return result;
            })
        );
        return launched;
    }

    stop(identifierOrUsername?: string, reason?: string): string[] {
        const stopped: string[] = [];
        const instancesToStop = (() => {
            if (identifierOrUsername) {
                const result = this.botInstances.find(instance => {
                    const botInformation = instance.bot.botInfo;
                    if (!botInformation) return false;
                    return (
                        botInformation.id.toString() === identifierOrUsername ||
                        botInformation.username === identifierOrUsername
                    );
                });
                return result ? [result] : [];
            }
            return this.botInstances.filter(
                instance => instance.state.isActive
            );
        })();

        for (const instance of instancesToStop) {
            instance.bot.stop(reason);
            instance.state.isActive = false;
            stopped.push(instance.bot.botInfo?.id.toString() ?? "");
        }

        return stopped;
    }

    async sendToAdministrators(
        message: string | { photo: string; text: string },
        configuration: {
            botId: string;
        }
    ): Promise<void> {
        const instance = this.get(configuration.botId);
        if (!instance) return;

        const bot = await STORE.getBotByTelegramId(configuration.botId);
        if (!bot) return;

        const administrators = bot.users
            .filter(user => user.is_administrator)
            .map(user => user.telegramProfile);
        await Promise.allSettled(
            administrators.map(async user => {
                if (typeof message === "string") {
                    return instance.bot.telegram.sendMessage(
                        user.telegram_id,
                        message
                    );
                }
                if (typeof message === "object" && "photo" in message) {
                    return instance.bot.telegram.sendPhoto(
                        user.telegram_id,
                        Input.fromLocalFile(message.photo),
                        {
                            caption: message.text,
                        }
                    );
                }
                return undefined;
            })
        );
    }
}

type Bot<TelegrafContext extends Context> = Telegraf<TelegrafContext>;

interface BotInstance<TelegrafContext extends Context> {
    bot: Bot<TelegrafContext>;
    state: BotState;
}

interface BotState {
    isActive: boolean;
}

const BOT_MANAGER = new BotManager<EngineContext>();
export default BOT_MANAGER;
