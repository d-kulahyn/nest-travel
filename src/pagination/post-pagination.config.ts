import {APP_URL} from "../config";
import {PaginateConfig} from "nestjs-paginate/lib/paginate";
import {PostViewEntity} from "../modules/user/entities/post-view.entity";

export const postPaginationConfig: PaginateConfig<PostViewEntity> = {
    sortableColumns: ['id'],
    nullSort: "last",
    searchableColumns: ['userId'],
    maxLimit: 20,
    defaultLimit: 10,
    origin: APP_URL
}