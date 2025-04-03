import {StorageInterface} from "../interfaces/storage.interface";
import {StorageConfig} from "../types/storage.type";
import {getFilename} from "../utils/storage";
import * as fs from 'fs';
import {join} from "path";
import {StorageEnum} from "../enums/storage-enum";
import {APP_URL} from "../config";

export class LocalStorageService implements StorageInterface {

    config: StorageConfig;

    constructor(config: StorageConfig) {
        this.config = config;
    }

    /**
     * @param file
     * @param subdirectory
     */
    storePublicly(file: Express.Multer.File, subdirectory?: string): string {
        const [filePath, filename] = getFilename(file);
        let fullPath = join(this.config.root, filePath);
        if (subdirectory) {
            fullPath = join(subdirectory, fullPath);
        }
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, {recursive: true})
        }
        fs.writeFileSync(join(fullPath, filename), file.buffer);

        return join(filePath, filename);
    }

    /**
     * @param filename
     */
    unlink(filename: string): void {
        fs.unlinkSync(join(this.config.root, filename));
    }

    /**
     * @return string
     */
    getType(): string {
        return StorageEnum.PUBLIC;
    }

    /**
     * @param filename
     */
    getUrl(filename: string): string {
        const host = APP_URL?.replace(/\/$/, "");
        filename = filename.replace(/^\//, "");

        return `${host}/${join(this.config.url, filename)}`;
    }
}