import { dbGetOne, dbPost } from "@/lib/drizzle-client";
import { CreateUserRequestDto, CreateUserResponseDto, UserLoginDb, UserLoginRequestDto } from "./model";
import { and, eq } from "drizzle-orm";
import { user } from "@/config/drizzle/schemas";
import { signToken } from "./jwt-parser";


export async function createUserLocalDb(
  dto: CreateUserRequestDto
): Promise<CreateUserResponseDto> {
  const user = dbPost("user", { pin: dto.passcode,organization_id:dto.organization_id });
  return user 
}


export async function authenticateUserDb(
  dto: UserLoginRequestDto
): Promise<UserLoginDb> {
  try {
    const userData = await dbGetOne("user", {
      where: and(eq(user.pin, dto.passcode), eq(user.is_active, true)),
      columns: {
        id: true,
        is_active: true,
        pin:true,
        organization_id:true
      } 
    });


    if (!userData) return {
       token:null,
       userId:null
    };

    const payload = {
      userId: userData.id!,
      sub:userData.pin,
      orgId: userData.organization_id,
    };

    const token = signToken(payload);

    return {
       token,
       userId:userData.id
    }
  } catch (error) {
    throw new Error("Error with authentication local" + error);
  }
}