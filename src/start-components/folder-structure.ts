import PATH from "../app/path";

export async function initializeFolderStructure() {
    await PATH.initializeStructure();
    console.log(`Folder structure initialized`);
}
