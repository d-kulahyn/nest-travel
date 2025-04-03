import {Injectable} from "@nestjs/common";
import {InjectEntityManager, InjectRepository} from "@nestjs/typeorm";
import {FileEntity} from "../entities/file.entity";
import {EntityManager, Repository} from "typeorm";
import {StorageFactory} from "../factories/storage.factory";

@Injectable()
export class FileRepository {

    constructor(
        @InjectEntityManager() private readonly entityManager: EntityManager,
        @InjectRepository(FileEntity) private readonly repository: Repository<FileEntity>,
        private readonly storageFactory: StorageFactory,
    ) {
    }

    /**
     * @param id
     */
    async deleteById(id: number | number[]) {
        await this.repository.delete(id);
    }

    /**
     * @param id
     */
    async findById(id: number): Promise<FileEntity | null> {
        return await this.repository.findOneBy({id});
    }

    /**
     * @param entityType
     * @param entityId
     */
    async deleteByEntity(entityId: number, entityType: string) {
        const storage = this.storageFactory.getStorage();
        const files = await this.getByEntity(entityId, entityType);
        await Promise.all(files.map((file) => storage.unlink(file.path)));
        await this.entityManager
            .getRepository(FileEntity)
            .createQueryBuilder()
            .delete()
            .from(FileEntity)
            .where({entityId, entityType})
            .execute();
    }

    /**
     * @param data
     */
    async create(data: Partial<FileEntity>): Promise<FileEntity> {
        const file = this.repository.create(data);
        await this.repository.save<FileEntity>(file, {reload: true});

        return file;
    }

    async update(fileId: number | number[], data: Partial<FileEntity>): Promise<void> {
        await this.repository.update(fileId, data);
    }

    async getByEntity(entityId: number, entityType: string): Promise<FileEntity[]> {
        return await this.repository.find({where: [{entityId}, {entityType}]});
    }
}