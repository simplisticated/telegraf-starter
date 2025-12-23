import { v4 as uuidv4 } from "uuid";
import { wait } from "./wait";

export default class Queue {
    private blocks: BlockContainer<any>[] = [];

    getNumberOfBlocks() {
        return this.blocks.length;
    }

    private updateHandlers: UpdateHandlerContainer[] = [];

    private started = false;

    constructor(
        private configuration: {
            timeIntervalBetweenIterations: number;
            numberOfBlocksToHandleDuringIteration: number;
            start: "immediately" | "when-added-first-block";
        }
    ) {
        if (this.configuration.start === "immediately") {
            this.start();
        }
    }

    add<Result>(block: Block<Result>): Promise<Result> {
        return new Promise(resolve => {
            const container: BlockContainer<Result> = {
                id: uuidv4(),
                block,
                completion: result => {
                    resolve(result);
                },
            };
            this.blocks.push(container);
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
        const index = this.blocks.findIndex(el => el.id === blockId);

        if (index >= 0 && index < this.blocks.length) {
            this.blocks.splice(index, 1);
            this.updatedBlocks();
        }
    }

    private async iteration() {
        const { numberOfBlocksToHandleDuringIteration } = this.configuration;

        if (!this.blocks.length) return;
        if (numberOfBlocksToHandleDuringIteration <= 0) return;

        const containers = this.blocks.slice(
            0,
            numberOfBlocksToHandleDuringIteration
        );

        await Promise.allSettled(
            containers.map(async blockContainer => {
                try {
                    const result = await blockContainer.block();
                    blockContainer.completion(result, null);
                } catch (error) {
                    blockContainer.completion(null, error);
                    console.error(error);
                } finally {
                    this.remove(blockContainer.id);
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
            if (this.blocks.length === requiredBlockCount) {
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
        const blockCount = this.blocks.length;
        this.updateHandlers.forEach(container => container.handler(blockCount));
    }
}

type Block<Result> = () => Promise<Result>;

type BlockContainer<Result> = {
    id: string;
    block: Block<Result>;
    completion: (result: Result, error: any) => void;
};

type UpdateHandler = (count: number) => any;

type UpdateHandlerContainer = {
    id: string;
    handler: UpdateHandler;
};
