import { ApiResponse } from "@/lib/model";
import { executePost } from "@/lib/http-client";
import {
  UserLoginRequestDto,
  UserLoginResponseDto,
} from "./model";



export async function authenticateUserApi(
  dto: UserLoginRequestDto
): Promise<ApiResponse<UserLoginResponseDto>> {
  try {
    return executePost({body:dto,resource:'/users/authenticate'});
  } catch (error) {
    throw new Error("Error with authentication" + error);
  }
}
