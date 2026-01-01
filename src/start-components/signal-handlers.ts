import BOT_MANAGER from "../bot/common/manager";
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
                    const botId = instance.bot.botInfo.id.toString();
                    await BOT_MANAGER.sendToAdministrators(
                        `Bot stopped: @${instance.bot.botInfo.username}\nReason: ${event}`,
                        {
                            botId,
                        }
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
