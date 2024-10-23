export interface CreateUserRequestDto {
  passcode: string;
  organization_id: string;
}

export interface CreateAccountRequestDto {
  email: string;
  username: string;
  password: string;
}

export type DbUser = {
  id: string | null;
  pin: string | null;
  orgId?:string
};

export interface TokenPayload {
  userId: string;
  sub: string;
  orgId: string;
}

export interface CreateAccountResponseDto {
  id: string;
}

export interface CreateUserResponseDto {
  id: string | number;
}

export interface UserLoginRequestDto {
  passcode: string;
}

export interface UserLoginResponseDto {
  token: string;
  userId: string;
  accountId: string;
  org: string;
  orgId: string;
}

export interface Role {
  name: string;
  permissions: string[];
}

export interface UserAccount {
  username: string;
  email: string;
  phone?: string;
  role: Role;
}

export interface AppUser {
  id: string;
  org: string;
  orgId: string;
}

export interface AppSession {
  token: string;
  expiresAt: Date;
  user: AppUser;
}
