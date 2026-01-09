/* eslint-disable no-param-reassign */
import { v4 as uuidv4 } from "uuid";
import { wait } from "./wait";

export default class Queue {
    private tasks: TaskContainer<any>[] = [];

    getNumberOfTasks() {
        return this.tasks.length;
    }

    private updateHandlers: UpdateHandlerContainer[] = [];

    private _state: "pending" | "running" | "stopped" = "pending";

    public get state() {
        return this._state;
    }

    private set state(value) {
        this._state = value;
    }

    constructor(private configuration: QueueConfiguration) {
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
    addWithErrorHandling<ResultValue>(
        task: Task<ResultValue>,
        key?: string
    ): Promise<TaskResult<ResultValue>> {
        return new Promise(resolve => {
            const container: TaskContainer<ResultValue> = {
                id: uuidv4(),
                key,
                task,
                state: "queued",
                completion: (result, error) => {
                    resolve({
                        value: result,
                        error,
                        isTimedOut: false,
                    });
                },
            };
            this.tasks.push(container);
            this.updatedBlocks();

            if (
                this.state === "pending" &&
                this.configuration.start === "when-added-first-task"
            ) {
                this.start();
            }

            if (this.configuration.taskTimeout) {
                container.timeoutId = setTimeout(() => {
                    if (container.state === "queued") {
                        this.removeTask(container.id);
                        resolve({
                            value: undefined,
                            error: new Error("Timeout"),
                            isTimedOut: true,
                        });
                    }
                }, this.configuration.taskTimeout);
            }
        });
    }

    /**
     * Упрощенная версия метода `addWithErrorHandling`.
     * Не проверяет ошибки, которые могут возникнуть при выполнении задачи.
     */
    async add<ResultValue>(
        task: Task<ResultValue>,
        key?: string
    ): Promise<ResultValue> {
        const result = await this.addWithErrorHandling(task, key);
        return result.value!;
    }

    private getTask(taskId: string): Task<any> | null {
        return (
            this.tasks.find(container => container.id === taskId)?.task ?? null
        );
    }

    private removeTask(taskId: string) {
        const index = this.tasks.findIndex(el => el.id === taskId);

        if (index >= 0 && index < this.tasks.length) {
            this.tasks.splice(index, 1);
            this.updatedBlocks();
        }
    }

    private async iteration() {
        if (!this.tasks.length) return;

        const { numberOfTasksToRunDuringIteration } = this.configuration;
        if (numberOfTasksToRunDuringIteration <= 0) return;

        const selectedContainers: TaskContainer<any>[] = [];
        const usedKeys = new Set<string>();

        // eslint-disable-next-line no-restricted-syntax
        for (const container of this.tasks) {
            if (
                selectedContainers.length >= numberOfTasksToRunDuringIteration
            ) {
                break;
            }

            if (!container.key || !usedKeys.has(container.key)) {
                selectedContainers.push(container);
                if (container.key) {
                    usedKeys.add(container.key);
                }
            }
        }

        await Promise.allSettled(
            selectedContainers.map(async taskContainer => {
                if (taskContainer.timeoutId) {
                    clearTimeout(taskContainer.timeoutId);
                    taskContainer.timeoutId = undefined;
                }
                try {
                    taskContainer.state = "running";
                    const result = await taskContainer.task();
                    taskContainer.state = "finished";
                    taskContainer.completion(result, null);
                } catch (error) {
                    taskContainer.state = "error";
                    taskContainer.completion(null, error);
                    console.error(error);
                } finally {
                    this.removeTask(taskContainer.id);
                }
            })
        );
    }

    async start() {
        this.state = "running";
        await this.iteration();
        await wait(this.configuration.timeIntervalBetweenIterations);
        if (this.state !== "running") return;
        setImmediate(this.start.bind(this));
    }

    stop() {
        this.state = "stopped";
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

    waitTillBlockCount(requiredBlockCount: number): Promise<void> {
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

type QueueStart = "immediately" | "when-added-first-task";

type QueueConfiguration = {
    timeIntervalBetweenIterations: number;
    numberOfTasksToRunDuringIteration: number;
    start?: QueueStart;
    taskTimeout?: number;
};

type Task<Result> = () => Promise<Result>;

type TaskState = "queued" | "running" | "finished" | "error";

type TaskContainer<Result> = {
    id: string;
    key?: string;
    task: Task<Result>;
    state: TaskState;
    timeoutId?: NodeJS.Timeout;
    completion: (result?: Result, error?: any) => void;
};

type TaskResult<Value> = {
    value: Value | undefined;
    error: any;
    isTimedOut: boolean;
};

type UpdateHandler = (count: number) => any;

type UpdateHandlerContainer = {
    id: string;
    handler: UpdateHandler;
};
