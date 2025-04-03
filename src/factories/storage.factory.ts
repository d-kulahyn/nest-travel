import {Injectable} from "@nestjs/common";
import {StorageEnum} from "../enums/storage-enum";
import {LocalStorageService} from "../services/local-storage.service";
import {StorageInterface} from "../interfaces/storage.interface";
import {config} from '../config/storages';

@Injectable()
export class StorageFactory {

    /**
     * @param storageType
     */
    getStorage(storageType: StorageEnum = StorageEnum.PUBLIC): StorageInterface {
        const options = config.disks.find((item) => item.driver === storageType)
        if (!options) {
            throw new Error(`Config options for driver ${storageType} not found.`)
        }
        switch (storageType) {
            case StorageEnum.PUBLIC:
                return new LocalStorageService(options);
            default:
                throw new Error(`Driver ${storageType} not found.`)
        }
    }
}