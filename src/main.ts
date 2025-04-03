import {HttpAdapterHost, NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {NestExpressApplication} from "@nestjs/platform-express";
import {UnprocessableEntityException, ValidationPipe} from "@nestjs/common";
import {API_PORT} from './config';
import {useContainer} from "class-validator";
import {ValidationError} from "@nestjs/common/interfaces/external/validation-error.interface";
import {ForbiddenExceptionFilter} from "./exception-filters/forbidden-exception.filter";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        abortOnError: false,
        rawBody: true,
        bodyParser: true
    });
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            exceptionFactory: (errors: ValidationError[]) => {
                //TODO: refactor to normal errors view
                return new UnprocessableEntityException(errors);
            }
        }),
    );
    app.useGlobalFilters(new ForbiddenExceptionFilter())
    useContainer(app.select(AppModule), {fallbackOnErrors: true});

    await app.listen(API_PORT);
}

bootstrap();
