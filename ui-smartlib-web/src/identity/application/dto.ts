export interface UserDto {
  id: string;
  org: string;
}
export interface UserAuthentication {
  token: string;
  user: UserDto;
}

export interface UserAuthResponse {
  token: string;
  orgId: string;
  userId: string;
}

export interface AuthCredential {
    value: string;
  }
