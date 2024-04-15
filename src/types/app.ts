export enum RouteIndex {
    HOME = '/',
    SIGNUP = '/signup',
    SIGNIN = '/signin',
    PASSWORD_RESET = '/password_reset',
    COMMUNITY = '/cummunity',
    DOWNLOAD = '/download',
    PFOFILE = '/profile',
    COMMUNITY_NEW_POST = '/community_new_post',
    COMMUNITY_USER_INFO = '/community_user/:id',
    MESSAGE = '/commnity_message',
    PRIVATE_MESSAGE = '/private_message',
    FOCUS_POST = '/focusPost',
    MySelf = '/myself'
}
export interface PostItems {
    post_id?: number,
    user_id?: number,
    title: string,
    content: string,
    created_at: Date,
    updated_at?: Date,
    name: string,
    likes: number,
    commentCount: number
    haveLiked: number
    count?: number
}