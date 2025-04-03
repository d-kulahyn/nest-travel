import {APP_URL} from "../config";
import {PaginateConfig} from "nestjs-paginate/lib/paginate";
import {PostEntity} from "../modules/user/entities/post.entity";

export const postViewPaginationConfig: PaginateConfig<PostEntity> = {
    sortableColumns: ['id'],
    nullSort: "last",
    searchableColumns: ['userId'],
    maxLimit: 20,
    defaultLimit: 10,
    origin: APP_URL
}