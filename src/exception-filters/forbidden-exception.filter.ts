import {ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus} from '@nestjs/common';
import {Response} from 'express';
import {ForbiddenError} from "@casl/ability";

@Catch(ForbiddenError)
export class ForbiddenExceptionFilter implements ExceptionFilter {
    catch(exception: ForbiddenError<any>, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = HttpStatus.FORBIDDEN;

        response
            .status(status)
            .json({
                statusCode: status,
                message: exception.message,
            });
    }
}