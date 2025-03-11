import { dbGetOne, dbPost } from "@/lib/drizzle-client";
import { CreateUserRequestDto, CreateUserResponseDto, DbUser } from "./model";
import { and, eq } from "drizzle-orm";
import { user_schema } from "@/config/drizzle/schemas";

export async function createUserLocalDb(
  dto: CreateUserRequestDto
): Promise<CreateUserResponseDto> {
  const user = dbPost("user_schema", {
    pin: dto.passcode,
    organization_id: dto.organization_id,
  });
  return user;
}

export async function getUser(dto: { passcode: string }): Promise<DbUser> {
  try {
    const userData = await dbGetOne("user_schema", {
      where: and(
        eq(user_schema.pin, dto.passcode),
        eq(user_schema.is_active, true)
      ),
      columns: {
        id: true,
        is_active: true,
        pin: true,
        organization_id: true,
      },
    });
    return {
      id: userData?.id,
      pin: userData?.pin,
      orgId: userData?.organization_id,
    };
  } catch (error) {
    throw new Error("Failed to load user, details: " + error);
  }
}
