import {
    ClassSerializerInterceptor,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    UseGuards,
    UseInterceptors
} from "@nestjs/common";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {UserRepository} from "../user/repositories/user-repository";
import {User} from "../auth/decorators/user.decorator";
import {AuthUser} from "../auth/types/auth-user";
import {plainToInstance} from "class-transformer";
import {ViewPostPaginationDto} from "../user/dto/pagination/view-post.pagination.dto";
import {Paginate, PaginateQuery} from "nestjs-paginate";

@Controller('v1/feeds')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
export class FeedController {

    constructor(private readonly userRepository: UserRepository) {
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async index(@User() user: AuthUser, @Paginate() query: PaginateQuery,) {
        return plainToInstance(
            ViewPostPaginationDto, await this.userRepository.feeds(user.userId, query),
            {excludeExtraneousValues: true}
        );
    }
}