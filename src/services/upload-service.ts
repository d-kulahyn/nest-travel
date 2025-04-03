import {Injectable} from "@nestjs/common";
import {StorageFactory} from "../factories/storage.factory";
import {FileRepository} from "../repositories/file-repository";
import {FileEntity} from "../entities/file.entity";

@Injectable()
export class UploadService {

    constructor(
        private readonly storageFactory: StorageFactory,
        private readonly fileRepository: FileRepository
    ) {
    }

    /**
     * @param files
     * @param path
     */
    async upload(files: Array<Express.Multer.File>, path: string): Promise<FileEntity[]> {
        return await Promise.all(files.map(async (uploadedFile) => {
            const storage = this.storageFactory.getStorage();
            const filename = storage.storePublicly(uploadedFile, path);
            return await this.fileRepository.create({
                path: filename,
                mimeType: uploadedFile.mimetype,
                storage: storage.getType()
            });
        }))
    }
}