import { redirect } from "next/navigation";
import { getUserSeccion } from "../identity/jwt-parser";
import { addItem, deleteItem } from "./cartMutationService";
import { InsertCart, InsertCartDetails } from "@/config/drizzle/schemas";

type CartItemFacade = Omit<InsertCartDetails, "user_id | cart_id">;

class CartServiceFacade {
  constructor() {}

  async createCart(input: InsertCart) {
    try {
      const addCartItem = await this.createCart(input);
      return addCartItem;
    } catch (error) {
      throw new Error("Error adding item to cart" + error);
    }
  }

  async addCartItem(input: CartItemFacade) {
    try {
      const userPayload = await getUserSeccion();

      if (!userPayload) {
        redirect("/auth/signin");
      }

      const data = {
        ...input,
        user_Id: userPayload.userId,
        cart_id: userPayload.cartId,
      };
      const addCartItem = await addItem(data);
      return addCartItem;
    } catch (error) {
      throw new Error("Error adding item to cart" + error);
    }
  }

  async deleteCartItem({ cartDetailsId }: { cartDetailsId: string }) {
    try {
      const userPayload = await getUserSeccion();

      if (!userPayload) {
        redirect("/auth/signin");
      }
      const addCartItem = await deleteItem({ cartDetailsId });
      return addCartItem;
    } catch (error) {
      throw new Error("Error adding item to cart" + error);
    }
  }
}

export const identityService = new CartServiceFacade();
