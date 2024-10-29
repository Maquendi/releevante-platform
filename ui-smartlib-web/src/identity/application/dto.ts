export interface UserDto {
  id: string;
  org: string;
  hash?: string
}
export interface UserAuthentication {
  token: string;
  user: UserDto;
}

export interface UserAuthResponse {
  token: string;
  orgId: string;
  userId: string;
  hash: string
}

export interface AuthCredential {
    value: string;
  }
