import {Injectable, BadRequestException, UnauthorizedException} from '@nestjs/common';
import {compare} from "bcryptjs";
import {JwtService} from "@nestjs/jwt";
import {JwtPayload} from "../types/jwt";
import {ResetPasswordAuthDto} from "../dto/reset-password-auth.dto";
import {RedisService} from "../../redis/redis.service";
import {MailService} from "../../mail/mail.service";
import {ConfirmEmailAuthDto} from "../dto/confirm-email-auth.dto";
import {UserRepository} from "../../user/repositories/user-repository";
import {randomBytes} from "crypto";
import {UserService} from "../../user/services/user.service";
import {CreateUserDto} from "../../user/dto/create-user.dto";
import {UserEntity} from "../../user/entities/user.entity";
import {EmailQueueService} from "../../queue/services/email-queue.service";
import {AuthTokenService} from "./auth-token.service";
import {SocialAuthDto} from "../dto/social-auth.dto";
import {SocialiteService} from "./socialite.service";
import {SocialiteEnum} from "../enums/socialite.enum";
import {SocialUserInterface} from "../interfaces/social-user.interface";
import {AbstractSocialProvider} from "../providers/abstract-social.provider";
import {UserLoginService} from "../../user/services/user-login.service";
import {Socket} from "socket.io";
import {AuthUser} from "../types/auth-user";

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly redisService: RedisService,
        private readonly userRepository: UserRepository,
        private readonly mailService: MailService,
        private readonly userService: UserService,
        private readonly emailQueueService: EmailQueueService,
        private readonly authTokenService: AuthTokenService,
        private readonly socialite: SocialiteService,
        private readonly userLoginService: UserLoginService
    ) {
    }

    /**
     * @param username
     * @param password
     */
    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userRepository.findByLogin(username);
        if (user !== null && await compare(password, user.password)) {
            const {password, ...result} = user;
            return result;
        }

        return null;
    }

    /**
     * @param user
     */
    async login(user: UserEntity): Promise<JwtPayload> {
        const payload = {sub: user.id};

        return {access_token: this.jwtService.sign(payload)};
    }

    /**
     * @param driver
     * @param socialAuthDto
     */
    async loginSocial(driver: SocialiteEnum, socialAuthDto: SocialAuthDto): Promise<JwtPayload> {
        const socialDriver: AbstractSocialProvider = await this.socialite.driver(driver);
        const socialUser: SocialUserInterface = await socialDriver.getUserByToken(socialAuthDto.accessToken);
        let user: UserEntity | null = await this.userRepository.findBySocial(socialUser.id);
        if (!user) {
            const userData: Partial<UserEntity> = {
                social: socialUser.id,
                emailVerifiedAt: new Date(),
                login: await this.userLoginService.getInternalUserLogin()
            };
            if (socialUser.email) {
                userData['email'] = socialUser.email
            }
            user = await this.userRepository.createUser(userData);
        }
        const payload = {sub: user.id}

        return {access_token: this.jwtService.sign(payload)};
    }

    /**
     * @param socketClient
     */
    wsAuth(socketClient: Socket): AuthUser {
        const authHeader = socketClient.handshake.headers.authorization;
        if (authHeader === undefined) {
            throw new UnauthorizedException();
        }
        const token: string = authHeader.split(' ').pop() as string;

        const payload = this.jwtService.verify(token);

        return {userId: payload.sub};

    }

    /**
     * @param confirmEmailAuthDto
     */
    async verifyEmail(confirmEmailAuthDto: ConfirmEmailAuthDto): Promise<void> {
        const user = await this.userRepository.findByEmail(confirmEmailAuthDto.email);
        if (user) {
            const token = await this.redisService.getConfirmEmailToken(confirmEmailAuthDto.email);
            if (!token) {
                throw new BadRequestException('Provided token is invalid.');
            }
            await this.userRepository.updateVerifiedAt(user.id);
        }
    }

    /**
     * @param resetPasswordDto
     */
    async resetPassword(resetPasswordDto: ResetPasswordAuthDto): Promise<void> {
        const password = randomBytes(8).toString('hex');
        const user = await this.userRepository.findByEmail(resetPasswordDto.email);
        if (user) {
            await Promise.all([
                this.userService.changePassword(user.id, password),
                this.emailQueueService.addResetPasswordJob(user, password)
            ]);
        }
    }

    /**
     * @param data
     * @param sendEmail
     */
    async signUp(data: CreateUserDto, sendEmail: boolean = true): Promise<JwtPayload> {
        const user: UserEntity = await this.userRepository.createUser(data);
        if (sendEmail) {
            const token = this.authTokenService.getConfirmationToken();
            await Promise.all([
                this.redisService.setConfirmEmailToken(user.email, token),
                this.emailQueueService.addConfirmEmailJob(user, String(token))
            ]);
        }
        const payload = {sub: user.id}

        return {access_token: this.jwtService.sign(payload)};
    }
}
