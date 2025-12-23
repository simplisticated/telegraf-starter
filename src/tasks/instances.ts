import Queue from "./queue";

export const DATABASE_QUEUE = new Queue({
    timeIntervalBetweenIterations: 1000,
    numberOfBlocksToHandleDuringIteration: 1,
    start: "immediately",
});

export const INCOMING_UPDATE_QUEUE = new Queue({
    timeIntervalBetweenIterations: 1000,
    numberOfBlocksToHandleDuringIteration: 5,
    start: "immediately",
});

export const OUTGOING_MESSAGE_QUEUE = new Queue({
    timeIntervalBetweenIterations: 1000,
    numberOfBlocksToHandleDuringIteration: 5,
    start: "immediately",
});

export const TELEGRAM_API_REQUEST_QUEUE = new Queue({
    timeIntervalBetweenIterations: 1000,
    numberOfBlocksToHandleDuringIteration: 5,
    start: "immediately",
});
