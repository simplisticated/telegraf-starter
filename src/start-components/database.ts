import STORE from "../data/store/store";

export async function initializeDatabase() {
    console.log(`Preparing database...`);
    const isStoreInitialized = await STORE.initialize();
    if (!isStoreInitialized) {
        console.error(`Database is not initialized`);
        process.exit();
    }
    console.log(`Database initialized`);
}
