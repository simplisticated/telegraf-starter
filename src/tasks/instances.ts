import Queue from "./queue";

export const QUEUE_INSTANCES = {
    database: new Queue({
        timeIntervalBetweenIterations: 50,
        numberOfTasksToRunDuringIteration: 1,
        start: "when-added-first-task",
    }),
    incomingTelegramUpdate: new Queue({
        timeIntervalBetweenIterations: 50,
        numberOfTasksToRunDuringIteration: 1,
        start: "when-added-first-task",
        taskTimeout: 60_000,
    }),
    telegramApiRequest: new Queue({
        timeIntervalBetweenIterations: 50,
        numberOfTasksToRunDuringIteration: 1,
        start: "when-added-first-task",
    }),
};

export function getAllQueueInstances(): Queue[] {
    return Object.values(QUEUE_INSTANCES);
}
