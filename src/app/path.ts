/* eslint-disable class-methods-use-this */
import path from "path";
import * as fs from "fs";
import ENV from "./env";

class Path {
    private async createFolder(folderPath: string): Promise<boolean> {
        if (fs.existsSync(folderPath)) {
            return true;
        }

        try {
            const result = await fs.promises.mkdir(folderPath, {
                recursive: true,
            });
            return result !== undefined;
        } catch {
            return false;
        }
    }

    async initializeStructure() {
        const allFolders = [this.dataFolder(), this.certificatesFolder()];

        // eslint-disable-next-line no-restricted-syntax
        for (const folder of allFolders) {
            // eslint-disable-next-line no-await-in-loop
            await this.createFolder(folder);
        }
    }

    dataFolder() {
        return path.resolve("data", ENV.APP_ENVIRONMENT);
    }

    database() {
        return path.resolve(this.dataFolder(), "database.sqlite");
    }

    certificatesFolder() {
        return path.resolve("certificates");
    }

    certificateFiles() {
        return {
            key_pem: path.resolve(this.certificatesFolder(), "key.pem"),
            cert_pem: path.resolve(this.certificatesFolder(), "cert.pem"),
        };
    }
}

const PATH = new Path();
export default PATH;
