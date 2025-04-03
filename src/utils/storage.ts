import {randomBytes} from "crypto";
import {join} from "path";
import {BadRequestException} from "@nestjs/common";

export function getFilename(file: Express.Multer.File): [string, string] {
    const mimetype = file.mimetype.split('/'),
        filename = randomBytes(32).toString('hex'),
        filenameWithExtension = `${filename}.${mimetype[1]}`,
        prefix = filename.split('');

    return [join(prefix[0], prefix[1], prefix[2]), filenameWithExtension];
}

export function fileFilter(extensions: Array<string>) {
    return (req: any, file: Express.Multer.File, callback: (error: (Error | null), acceptFile: boolean) => void) => {
        if (extensions.includes(file.mimetype.split('/')[1])) {
            callback(null, true);
            return;
        }
        callback(new BadRequestException('Invalid file extension.'), false)
    }
}