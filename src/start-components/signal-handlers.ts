import BOT_MANAGER from "../bot/common/manager";
import SERVER_MANAGER from "../server/manager";
import { QUEUE_INSTANCES } from "../tasks/instances";
import { wait } from "../tasks/wait";

export function setupSignalHandlers() {
    ["SIGINT", "SIGTERM", "SIGQUIT"].forEach((event: any) => {
        process.once(event, async () => {
            console.log(`Получил сигнал ${event}`);

            const botInstances = BOT_MANAGER.getAll().filter(
                instance => instance.state.isActive
            );

            console.log(`Закрываем ботов...`);
            botInstances.forEach(instance =>
                instance.bot.stop(event ? `${event}` : undefined)
            );

            console.log(`Уведомляем администраторов ботов...`);
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
                })
            );

            console.log(`Останавливаем очередь задач...`);
            await QUEUE_INSTANCES.incomingTelegramUpdate.waitTillBlockCount(0);
            QUEUE_INSTANCES.incomingTelegramUpdate.stop();

            console.log(`Закрываем все соединения...`);
            await SERVER_MANAGER.close();

            console.log(`Завершаем процесс`);
            await QUEUE_INSTANCES.database.waitTillBlockCount(0);
            await wait(1000);
            process.exit();
        });
    });
}
