import { v4 as uuidv4 } from "uuid";
import { wait } from "./wait";

export default class Queue {
    private tasks: TaskContainer<any>[] = [];

    getNumberOfTasks() {
        return this.tasks.length;
    }

    private updateHandlers: UpdateHandlerContainer[] = [];

    private started = false;

    constructor(
        private configuration: {
            timeIntervalBetweenIterations: number;
            numberOfTasksToRunDuringIteration: number;
            start: "immediately" | "when-added-first-block";
        }
    ) {
        if (this.configuration.start === "immediately") {
            this.start();
        }
    }

    /**
     * Добавляет задачу в очередь.
     * @param task Задача.
     * @param key Необязательный ключ. Задачи с одинаковым ключом не попадают в одну итерацию.
     * Это можно использовать, к примеру, если требуется последовательно обрабатывать задачи
     * для конкретного пользователя в многопользовательской среде.
     * В таком случае достаточно указать ID пользователя в качестве ключа и тогда задачи,
     * связанные с этим пользователем, будут выполняться последовательно.
     * @returns Результат выполнения задачи.
     */
    add<Result>(task: Task<Result>, key?: string): Promise<Result> {
        return new Promise(resolve => {
            const container: TaskContainer<Result> = {
                id: uuidv4(),
                key,
                block: task,
                completion: result => {
                    resolve(result);
                },
            };
            this.tasks.push(container);
            this.updatedBlocks();

            if (
                !this.started &&
                this.configuration.start === "when-added-first-block"
            ) {
                this.start();
            }
        });
    }

    private remove(blockId: string) {
        const index = this.tasks.findIndex(el => el.id === blockId);

        if (index >= 0 && index < this.tasks.length) {
            this.tasks.splice(index, 1);
            this.updatedBlocks();
        }
    }

    private async iteration() {
        const { numberOfTasksToRunDuringIteration } = this.configuration;

        if (!this.tasks.length) return;
        if (numberOfTasksToRunDuringIteration <= 0) return;

        const containers: TaskContainer<any>[] = [];
        const usedKeys = new Set<string>();

        // eslint-disable-next-line no-restricted-syntax
        for (const container of this.tasks) {
            if (containers.length >= numberOfTasksToRunDuringIteration) {
                break;
            }

            if (!container.key || !usedKeys.has(container.key)) {
                containers.push(container);
                if (container.key) {
                    usedKeys.add(container.key);
                }
            }
        }

        await Promise.allSettled(
            containers.map(async taskContainer => {
                try {
                    const result = await taskContainer.block();
                    taskContainer.completion(result, null);
                } catch (error) {
                    taskContainer.completion(null, error);
                    console.error(error);
                } finally {
                    this.remove(taskContainer.id);
                }
            })
        );
    }

    private async start() {
        await this.iteration();
        await wait(this.configuration.timeIntervalBetweenIterations);
        setImmediate(this.start.bind(this));
    }

    subscribe(handler: UpdateHandler): string {
        const container: UpdateHandlerContainer = {
            id: uuidv4(),
            handler,
        };
        this.updateHandlers.push(container);
        return container.id;
    }

    unsubscribe(identifier: string) {
        const index = this.updateHandlers.findIndex(el => el.id === identifier);

        if (index >= 0 && index < this.updateHandlers.length) {
            this.updateHandlers.splice(index, 1);
        }
    }

    async waitTillBlockCount(requiredBlockCount: number): Promise<void> {
        return new Promise(resolve => {
            if (this.tasks.length === requiredBlockCount) {
                resolve();
                return;
            }
            const subscriptionIdentifier = this.subscribe(currentBlockCount => {
                if (currentBlockCount === requiredBlockCount) {
                    this.unsubscribe(subscriptionIdentifier);
                    resolve();
                }
            });
        });
    }

    private updatedBlocks() {
        const blockCount = this.tasks.length;
        this.updateHandlers.forEach(container => container.handler(blockCount));
    }
}

type Task<Result> = () => Promise<Result>;

type TaskContainer<Result> = {
    id: string;
    key?: string;
    block: Task<Result>;
    completion: (result: Result, error: any) => void;
};

type UpdateHandler = (count: number) => any;

type UpdateHandlerContainer = {
    id: string;
    handler: UpdateHandler;
};
