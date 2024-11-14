import { dbGetOne } from "@/lib/db/drizzle-client";
import { User } from "../domain/models";
import { UserRepository } from "../domain/repositories";
import { and, eq } from "drizzle-orm";
import { userSchema } from "@/config/drizzle/schemas";

// uses drizzle as dal
export class DefaultUserRepositoryImpl implements UserRepository {
  constructor() {}
  async findBy(credential: string): Promise<User> {
    try {
      const userData = await dbGetOne("userSchema", {
        where: and(
          eq(userSchema.pin, credential),
          eq(userSchema.is_active, true)
        ),
        columns: {
          id: true,
          is_active: true,
          pin: true,
          organization_id: true,
        },
      });
      return new User({
        id: userData?.id,
        org: userData?.organization_id,
      });
    } catch (error) {
      throw new Error("Failed to load user, details: " + error);
    }
  }

  create(user: User): Promise<User> {
    throw new Error("Method not implemented." + user);
  }

  update(user: User): Promise<User> {
    throw new Error("Method not implemented." + user);
  }
}
