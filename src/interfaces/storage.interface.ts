import {StorageConfig} from "../types/storage.type";

export interface StorageInterface {
    config: StorageConfig;

    storePublicly(file: Express.Multer.File, filepath?: string): string;

    getUrl(filename: string): string;

    getType(): string;

    unlink(filename: string): void;
}