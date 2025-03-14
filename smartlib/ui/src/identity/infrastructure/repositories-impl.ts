import { dbGetOne } from "@/lib/db/drizzle-client";
import { User } from "../domain/models";
import { UserRepository } from "../domain/repositories";
import { and, eq } from "drizzle-orm";
import { userSchema } from "@/config/drizzle/schemas";

// uses drizzle as dal
export class DefaultUserRepositoryImpl implements UserRepository {
  constructor() {}
  async findBy(credential: string, useContactless: boolean): Promise<User> {
    try {
      const userData = await dbGetOne("userSchema", {
        where: and(
          (useContactless && eq(userSchema.contactless, credential)) ||
            eq(userSchema.credential, credential),
          eq(userSchema.isActive, true)
        ),
        columns: {
          id: true,
          isActive: true,
          pin: true,
        },
      });
      return new User({
        id: userData?.id,
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
