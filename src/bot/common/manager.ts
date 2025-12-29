/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
import { Context, Telegraf } from "telegraf";
import { launchBot } from "./launch";
import { EngineContext } from "../session/context";

class BotManager<TelegrafContext extends Context> {
    private botList: BotState<TelegrafContext>[] = [];

    add(bot: Telegraf<TelegrafContext> | Telegraf<TelegrafContext>[]) {
        if (Array.isArray(bot)) {
            this.botList.push(
                ...bot.map(value => ({
                    bot: value,
                    isActive: false,
                }))
            );
        } else {
            this.botList.push({
                bot,
                isActive: false,
            });
        }
    }

    launch() {
        return Promise.allSettled(
            this.botList.map(state => {
                state.isActive = true;
                return launchBot(state.bot);
            })
        );
    }

    stop(id?: string, reason?: string) {
        if (id) {
            const stateForSelectedBot = this.botList.find(
                state => state.bot.botInfo?.id.toString() === id
            );
            if (stateForSelectedBot) {
                stateForSelectedBot.bot.stop(reason);
                stateForSelectedBot.isActive = false;
            }
        } else {
            const filteredState = this.botList.filter(state => state.isActive);
            for (const state of filteredState) {
                state.bot.stop(reason);
                state.isActive = false;
            }
        }
    }
}

interface BotState<TelegrafContext extends Context> {
    bot: Telegraf<TelegrafContext>;
    isActive: boolean;
}

const BOT_MANAGER = new BotManager<EngineContext>();
export default BOT_MANAGER;
