import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    Request,
    UseInterceptors,
    ClassSerializerInterceptor, Param, HttpCode, HttpStatus
} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {AuthService} from './services/auth.service';
import {LoginAuthDto} from "./dto/login-auth.dto";
import {JwtAuthGuard} from "./guards/jwt-auth.guard";
import {CreateUserDto} from "../user/dto/create-user.dto";
import {ResetPasswordAuthDto} from "./dto/reset-password-auth.dto";
import {ConfirmEmailAuthDto} from "./dto/confirm-email-auth.dto";
import {UserRepository} from "../user/repositories/user-repository";
import {plainToInstance} from "class-transformer";
import {ViewUserDto} from "../user/dto/view/view-user.dto";
import {SocialAuthDto} from "./dto/social-auth.dto";
import {JwtPayload} from "./types/jwt";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userRepository: UserRepository,
    ) {
    }

    @Post('login')
    @UseGuards(AuthGuard('local'))
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginAuthDto: LoginAuthDto, @Request() req: any): Promise<JwtPayload> {
        return this.authService.login(req.user);
    }

    @Post('social/:social')
    @HttpCode(HttpStatus.CREATED)
    async socialSignin(@Body() socialAuthDto: SocialAuthDto, @Param() params: any): Promise<JwtPayload> {
        return await this.authService.loginSocial(params.social, socialAuthDto);
    }

    @Post('signup')
    @UseInterceptors(ClassSerializerInterceptor)
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createUserDto: CreateUserDto): Promise<JwtPayload> {
        return await this.authService.signUp(createUserDto);
    }

    @Get('me')
    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async me(@Request() req: any): Promise<ViewUserDto | null> {
        return plainToInstance(ViewUserDto, this.userRepository.findById(req.user.userId, ['avatar']), {
            excludeExtraneousValues: true,
        });
    }

    @Post('confirm-email')
    @HttpCode(HttpStatus.OK)
    async confirmEmail(@Body() confirmEmailDto: ConfirmEmailAuthDto): Promise<void> {
        await this.authService.verifyEmail(confirmEmailDto);
    }

    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    async resetPassword(@Body() resetPasswordDto: ResetPasswordAuthDto): Promise<void> {
        await this.authService.resetPassword(resetPasswordDto);
    }
}
