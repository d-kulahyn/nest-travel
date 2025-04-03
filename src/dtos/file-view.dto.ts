import {Expose, Transform, TransformFnParams} from "class-transformer";
import {StorageFactory} from "../factories/storage.factory";

export class FileViewDto {

    @Expose()
    id: number;

    @Expose()
    @Transform((params: TransformFnParams) => {
        const storageFactory = new StorageFactory();
        return storageFactory.getStorage(params.obj.storage).getUrl(params.obj.path);
    }, {toClassOnly: true})
    path: string;

    @Expose()
    mimeType: string;
}