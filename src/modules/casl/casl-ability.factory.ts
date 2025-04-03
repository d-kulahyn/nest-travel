import {
    AbilityBuilder,
    InferSubjects, ExtractSubjectType, PureAbility, AbilityTuple, MatchConditions,
} from '@casl/ability';
import {AuthUser} from "../auth/types/auth-user";
import {PostEntity} from "../user/entities/post.entity";
import {UserEntity} from "../user/entities/user.entity";
import {PostCommentEntity} from "../user/entities/post-comment.entity";
import {PostLikeEntity} from "../user/entities/post-like.entity";
import {PostFavoriteEntity} from "../user/entities/post-favorite.entity";

export enum Action {
    CREATE = 'create',
    READ = 'read',
    UPDATE = 'update',
    DELETE = 'delete',
    MANAGE = 'manage'
}

type Subjects =
    InferSubjects<typeof PostEntity | typeof UserEntity | typeof PostCommentEntity | typeof PostLikeEntity | typeof PostFavoriteEntity>
    | 'all';

export type AppAbility = PureAbility<AbilityTuple, MatchConditions>;

const lambdaMatcher = (matchConditions: MatchConditions) => matchConditions;

export default function defineAbilityForUser(user: AuthUser): AppAbility {

    const {can, cannot, build} = new AbilityBuilder<AppAbility>(PureAbility);

    can(Action.MANAGE, PostEntity, ({userId}) => {
        return userId === user.userId;
    });

    can(Action.CREATE, UserEntity, ({id}) => {
        return id === user.userId;
    });

    can(Action.MANAGE, PostCommentEntity, ({userId}) => {
        return user.userId === userId;
    });

    can(Action.MANAGE, PostLikeEntity, ({userId}) => {
        return user.userId === userId
    });

    can(Action.MANAGE, PostFavoriteEntity, ({userId}) => {
        return user.userId === userId
    });

    return build({
        conditionsMatcher: lambdaMatcher,
        detectSubjectType: (item) =>
            item.constructor as ExtractSubjectType<Subjects>,
    });
}