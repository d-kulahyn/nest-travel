import {compare, genSalt, hash} from 'bcryptjs';
import {UserRepository} from "../repositories/user-repository";
import {BadRequestException, Injectable} from "@nestjs/common";
import {UpdateUserDto} from "../dto/update-user.dto";
import {UpdateUserEmailDto} from "../dto/update-user-email.dto";
import {UserEntity} from "../entities/user.entity";
import {EmailQueueService} from "../../queue/services/email-queue.service";
import {AuthTokenService} from "../../auth/services/auth-token.service";
import {UpdateUserPasswordDto} from "../dto/update-user-password.dto";
import {StorageFactory} from "../../../factories/storage.factory";
import {FileRepository} from "../../../repositories/file-repository";
import {UserFriendshipDto} from "../dto/user-friendship.dto";
import {FriendshipActionEnum} from "../enums/friendship-action.enum";
import {FileEntity} from "../../../entities/file.entity";
import {UserInfoInterface} from "../interfaces/user-info.interface";
import {Paginated, PaginateQuery} from "nestjs-paginate";
import {FriendshipTypeEnum} from "../enums/friendship-type.enum";

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly emailQueueService: EmailQueueService,
        private readonly authTokenService: AuthTokenService,
        private readonly storageFactory: StorageFactory,
        private readonly fileRepository: FileRepository
    ) {
    }

    async getUserInfo(userId: number, authUserId: number): Promise<UserInfoInterface> {
        const user: UserEntity | null = await this.userRepository.findById(userId);
        if (user === null) {
            throw new BadRequestException('User not found')
        }

        return await this.userRepository.getUserInfo(userId, authUserId);
    }

    /**
     * @param userId
     * @param password
     */
    async changePassword(userId: number, password: string): Promise<void> {
        const user = await this.userRepository.findById(userId);
        if (user === null) throw new BadRequestException('User not found.');
        password = await hash(password, await genSalt());
        await this.userRepository.update(userId, {password, passwordChangedAt: new Date()});
    }

    /**
     * @param updateUserDto
     * @param userId
     */
    async updateProfile(updateUserDto: Partial<UpdateUserDto>, userId: number) {
        const user: UserEntity | null = await this.userRepository.findByLogin(updateUserDto.login as string);
        if (user?.login === updateUserDto.login && user?.id !== userId) {
            throw new BadRequestException('The login is already exist');
        }
        await this.userRepository.update(userId, updateUserDto);
    }

    /**
     * @param updateUserEmailDto
     * @param userId
     */
    async updateUserEmail(updateUserEmailDto: UpdateUserEmailDto, userId: number): Promise<void> {
        const user: UserEntity | null = await this.userRepository.findById(userId);
        if (user === null) {
            throw new BadRequestException('User not found.');
        }
        if (user.passwordChangedAt === null) {
            throw new BadRequestException('You can not update email while don\'t confirm previous one.');
        }
        const token = this.authTokenService.getConfirmationToken();
        await Promise.all([
            this.userRepository.update(userId, {...updateUserEmailDto, oldEmail: user.email, emailVerifiedAt: null}),
            this.emailQueueService.addSuspiciousEmailJob(user),
            this.emailQueueService.addConfirmEmailJob({email: updateUserEmailDto.email}, String(token))
        ])
    }

    /**
     * @param updateUserPasswordDto
     * @param userId
     */
    async updateUserPassword(updateUserPasswordDto: UpdateUserPasswordDto, userId: number): Promise<void> {
        const user: UserEntity | null = await this.userRepository.findById(userId);
        if (user === null) {
            throw new BadRequestException('User not found.');
        }
        if (!await compare(updateUserPasswordDto.password, user.password)) {
            throw new BadRequestException('Wrong password.');
        }
        const password = await hash(updateUserPasswordDto.newPassword, await genSalt());
        await this.userRepository.update(userId, {password, passwordChangedAt: new Date()});
    }

    /**
     * @param avatar
     * @param userId
     */
    async updateAvatar(avatar: Express.Multer.File, userId: number): Promise<FileEntity> {
        const user: UserEntity | null = await this.userRepository.findById(userId, ['avatar']);
        if (user === null) {
            throw new BadRequestException('User not found.');
        }
        const storage = this.storageFactory.getStorage();
        if (user.avatar) {
            storage.unlink(user.avatar.path);
            await this.fileRepository.deleteById(user.avatar.id);
        }
        const filename = storage.storePublicly(avatar, 'avatars');
        const file = await this.fileRepository.create({
            path: filename,
            entityType: UserEntity.name,
            entityId: userId,
            mimeType: avatar.mimetype,
            storage: storage.getType()
        });
        await this.userRepository.update(userId, {avatarId: file.id})

        return file;
    }

    /**
     * @param userId
     * @param friendshipDto
     * @param action
     */
    async doFriendship(userId: number, friendshipDto: UserFriendshipDto, action: FriendshipActionEnum): Promise<void> {
        const user: UserEntity | null = await this.userRepository.findById(userId);
        const friendship: UserEntity | null = await this.userRepository.findById(friendshipDto.userId);
        if (user === null || friendship === null) {
            throw new BadRequestException('User or friendship not found.');
        }
        if (user.id === friendship.id) {
            throw new BadRequestException('You can\'t follow yourself');
        }
        try {
            if (action === FriendshipActionEnum.ADD) {
                await this.userRepository.attachFriendship(friendshipDto.userId, userId);
            } else if (action === FriendshipActionEnum.REMOVE) {
                await this.userRepository.detachFriendship(friendshipDto.userId, userId);
            }
        } catch (e) {
            throw new BadRequestException('Probably you already followed this user');
        }
    }

    /**
     * @param userId
     * @param query
     * @param friendship
     */
    async paginate(userId: number, query: PaginateQuery, friendship?: FriendshipTypeEnum): Promise<Paginated<UserEntity>> {
        const user: UserEntity | null = await this.userRepository.findById(userId);
        if (!user) {
            throw new BadRequestException('User no found');
        }
        return await this.userRepository.paginate(userId, query, friendship);
    }
}
