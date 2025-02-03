export interface CreateUserRequestDto{
    fullName: string;
}

export interface CreateAccountRequestDto{
    email:string;
    username: string;
    password: string;
}

export interface CreateAccountResponseDto{
    id:string
}

export interface CreateUserResponseDto{
    id: string;
}

export interface UserLoginRequestDto {
    username: string;
    password: string;
}



export interface UserLoginResponseDto{
    token:string;
    userId:string;
    accountId:string;
    fullName: string;
    org:string;
    orgId:string;
    email: string;
    phone?:string;
}

export interface Role{
    name: string;
    permissions: string[]
}

export interface UserAccount {
    username:string;
    email:string;
    phone?:string;
    role: Role
}

export interface AppUser {
    id:string;
    fullName: string;
    org:string;
    orgId:string;
    account: UserAccount
}

export interface AppSession {
    token: string;
    expiresAt: Date,
    user: AppUser
}

