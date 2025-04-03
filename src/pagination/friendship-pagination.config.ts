import {APP_URL} from "../config";
import {PaginateConfig} from "nestjs-paginate/lib/paginate";
import {UserEntity} from "../modules/user/entities/user.entity";

export const friendshipPaginationConfig: PaginateConfig<UserEntity> = {
    sortableColumns: ['id'],
    nullSort: "last",
    maxLimit: 20,
    defaultLimit: 10,
    origin: APP_URL
}