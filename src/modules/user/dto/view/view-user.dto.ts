import {Expose, Transform, TransformFnParams, Type} from "class-transformer";
import {FileViewDto} from "../../../../dtos/file-view.dto";

export class ViewUserDto {

    @Expose()
    id: number;

    @Expose()
    login: string;

    @Expose()
    name: string;

    @Expose()
    email: string;

    @Expose()
    aboutMe: string;

    @Expose()
    myWebsite: string;

    @Expose()
    telephone: string;

    @Expose()
    @Transform((params: TransformFnParams) => {
        return params.obj?.emailVerifiedAt !== null;
    }, {toClassOnly: true})
    emailIsVerified: boolean;

    @Type(() => FileViewDto)
    @Expose()
    avatar: FileViewDto;

    @Type(() => ViewUserDto)
    @Expose()
    followers: ViewUserDto;

    @Type(() => ViewUserDto)
    @Expose()
    followings: ViewUserDto;
}