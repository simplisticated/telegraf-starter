/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
import { Context, Telegraf } from "telegraf";
import { launchBot } from "./launch";
import { EngineContext } from "../session/context";

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
