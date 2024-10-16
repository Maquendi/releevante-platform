import { ApiResponse, buildRequest } from "@/lib/model";
import { executePost } from "@/lib/http-client";
import { CreateAccountRequestDto, CreateAccountResponseDto, CreateUserRequestDto, CreateUserResponseDto, UserLoginRequestDto, UserLoginResponseDto } from "./model";


export async function createAccount(dto: CreateAccountRequestDto): Promise<ApiResponse<CreateAccountResponseDto>> {
    return buildRequest(`accounts`, dto).then(request => executePost(request));
}

export async function createUser(dto: CreateUserRequestDto): Promise<ApiResponse<CreateUserResponseDto>> {
    return buildRequest(`users`, dto).then(request => executePost(request));
}


export async function authenticateUser(dto: UserLoginRequestDto): Promise<ApiResponse<UserLoginResponseDto>> {
    return buildRequest(`users/auth`, dto).then(request => executePost(request));
}