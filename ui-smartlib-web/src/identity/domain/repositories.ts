import { User } from "./models";

export interface UserRepository {
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
  findBy(credential: string, useContactless: boolean): Promise<User>;
}
