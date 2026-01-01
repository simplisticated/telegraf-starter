import BOT_MANAGER from "../bot/common/manager";
import STORE from "../data/store/store";
import SERVER_MANAGER from "../server/manager";
import { wait } from "../tasks/wait";

export function setupSignalHandlers() {
    ["SIGINT", "SIGTERM", "SIGQUIT"].forEach((event: any) => {
        process.once(event, async () => {
            console.log(`Получил сигнал ${event}`);
            console.log(`Уведомляем администраторов ботов...`);
            const botInstances = BOT_MANAGER.getAll().filter(
                instance => instance.state.isActive
            );
            await Promise.allSettled(
                botInstances.map(async instance => {
                    if (!instance.bot.botInfo) return;
                    const bot = await STORE.getBotByTelegramId(
                        instance.bot.botInfo.id.toString()
                    );
                    if (!bot) return;
                    const administrators = bot.users
                        .filter(user => user.is_administrator)
                        .map(user => user.telegramProfile);
                    await Promise.allSettled(
                        administrators.map(async user => {
                            await instance.bot.telegram.sendMessage(
                                user.telegram_id,
                                `Bot stopped: @${bot.username}\nReason: ${event}`
                            );
                        })
                    );
                    instance.bot.stop(event ? `${event}` : undefined);
                })
            );
            console.log(`Закрываем все соединения...`);
            await SERVER_MANAGER.close();
            console.log(`Завершаем процесс`);
            await wait(1000);
            process.exit();
        });
    });
}
