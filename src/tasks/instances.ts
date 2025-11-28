import Queue from "./queue";

export const DATABASE_QUEUE = new Queue({
    timeIntervalBetweenIterations: 1000,
    numberOfBlocksToHandleDuringIteration: 1,
    start: "immediately",
});

export const MESSAGE_QUEUE = new Queue({
    timeIntervalBetweenIterations: 1000,
    numberOfBlocksToHandleDuringIteration: 5,
    start: "immediately",
});
