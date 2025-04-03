import {join} from "path";
import {StorageEnum} from "../enums/storage-enum";

export const config = {
    disks: [
        {
            driver: StorageEnum.PUBLIC,
            root: join(__dirname, '/../public'),
            url: 'public'
        }
    ]
};

export const MAX_FILE_SIZE = 10000000;