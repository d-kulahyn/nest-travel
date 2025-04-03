import {Injectable} from "@nestjs/common";
import {MulterModuleOptions, MulterOptionsFactory} from "@nestjs/platform-express";
import {memoryStorage} from "multer";

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
    createMulterOptions(): MulterModuleOptions {
        return {
            dest: '/backend_api',
            storage: memoryStorage()
        };
    }
}