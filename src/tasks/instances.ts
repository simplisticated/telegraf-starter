import Queue from "./queue";

export const DATABASE_QUEUE = new Queue({
    timeIntervalBetweenIterations: 1000,
    numberOfTasksToRunDuringIteration: 5,
    start: "immediately",
});

export const INCOMING_TELEGRAM_UPDATE_QUEUE = new Queue({
    timeIntervalBetweenIterations: 1000,
    numberOfTasksToRunDuringIteration: 20,
    start: "immediately",
    taskTimeout: 60_000,
});

export const OUTGOING_MESSAGE_QUEUE = new Queue({
    timeIntervalBetweenIterations: 1000,
    numberOfTasksToRunDuringIteration: 20,
    start: "immediately",
});

export const TELEGRAM_API_REQUEST_QUEUE = new Queue({
    timeIntervalBetweenIterations: 1000,
    numberOfTasksToRunDuringIteration: 5,
    start: "immediately",
});
