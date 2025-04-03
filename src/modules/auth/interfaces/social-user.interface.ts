export interface SocialUserInterface {
    id: string;
    email: string | null;
    avatar: string | null;
}

export interface GoogleSocialInterface extends SocialUserInterface{
    sub: string,
    given_name: string | null,
    family_name: string | null,
}

export interface FacebookSocialInterface extends SocialUserInterface{
    name: string | null,
}