import {APP_URL} from "../config";
import {PaginateConfig} from "nestjs-paginate/lib/paginate";
import {PostCommentEntity} from "../modules/user/entities/post-comment.entity";

export const postCommentPaginationConfig: PaginateConfig<PostCommentEntity> = {
    sortableColumns: ['id'],
    nullSort: "last",
    searchableColumns: ['userId'],
    maxLimit: 20,
    defaultLimit: 10,
    origin: APP_URL
}