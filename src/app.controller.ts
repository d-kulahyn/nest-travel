import {
    ClassSerializerInterceptor,
    Controller,
    Post,
    UploadedFiles, UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {AnyFilesInterceptor, FilesInterceptor} from "@nestjs/platform-express";
import {fileFilter} from "./utils/storage";
import {MAX_FILE_SIZE} from "./config/storages";
import {FileViewDto} from "./dtos/file-view.dto";
import {plainToInstance} from "class-transformer";
import {JwtAuthGuard} from "./modules/auth/guards/jwt-auth.guard";
import {UploadService} from "./services/upload-service";

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
export class AppController {
    constructor(private readonly uploadService: UploadService) {
    }

    @Post('upload')
    @UseInterceptors(AnyFilesInterceptor({
        fileFilter: fileFilter(['jpeg', 'jpg', 'png']),
        limits: {fileSize: MAX_FILE_SIZE, files: 20}
    }))
    async uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
        return plainToInstance(FileViewDto, await this.uploadService.upload(files, 'posts'), {
            excludeExtraneousValues: true
        });
    }
}
