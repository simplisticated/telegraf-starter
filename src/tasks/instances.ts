import Queue from "./queue";

export const QUEUE_INSTANCES = {
    database: new Queue({
        timeIntervalBetweenIterations: 50,
        numberOfTasksToRunDuringIteration: 1,
        start: "immediately",
    }),
    incomingTelegramUpdate: new Queue({
        timeIntervalBetweenIterations: 50,
        numberOfTasksToRunDuringIteration: 1,
        start: "immediately",
        taskTimeout: 60_000,
    }),
    outgoingMessage: new Queue({
        timeIntervalBetweenIterations: 50,
        numberOfTasksToRunDuringIteration: 1,
        start: "immediately",
    }),
    telegramApiRequest: new Queue({
        timeIntervalBetweenIterations: 50,
        numberOfTasksToRunDuringIteration: 1,
        start: "immediately",
    }),
};

export function getAllQueueInstances(): Queue[] {
    return Object.values(QUEUE_INSTANCES);
}
