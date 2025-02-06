import { cartItemSchema, cartSchema } from "@/config/drizzle/schemas/cart";
import { Cart, CartId, CartItem } from "../domain/cart.model";
import { CartRepository } from "../domain/repositories";
import { ClientTransaction } from "@/lib/db/transaction-manager";
import { SQLiteTransaction } from "drizzle-orm/sqlite-core";
import { and, eq, or } from "drizzle-orm";
import { dbGetOne, executeTransaction } from "@/lib/db/drizzle-client";
import { UserId } from "@/identity/domain/models";

class CartRepositoryImpl implements CartRepository {
  async findByUser(userId: UserId): Promise<Cart> {
    const data = await dbGetOne("cartSchema", {
      id: cartSchema.id,
      with: {
        items: {
          columns: {
            id: true,
            qty: true,
            isbn: true,
            transactionType: true,
          },
        },
      },
      where: and(
        eq(cartSchema.user_id, userId.value),
        or(
          eq(cartSchema.state, "PENDING"),
          eq(cartSchema.state, "CHECKOUT_FAILED"),
          eq(cartSchema.state, "CHECKING_OUT"),
          eq(cartSchema.state, "STALE")
        )
      ),
    });

    const cartItems: CartItem[] =
      data?.items?.map((item) => ({
        id: item.id,
        isbn: item.isbn,
        qty: item.qty,
        transactionType: item.transactionType,
      })) || [];

    return new Cart({ value: data.id }, userId, cartItems);
  }
  async findById(cartId: CartId): Promise<Cart> {
    const data = await dbGetOne("cartSchema", {
      with: {
        items: {
          columns: {
            id: true,
            qty: true,
            isbn: true,
            transactionType: true,
          },
        },
      },
      where: eq(cartSchema.id, cartId.value),
    });

    const userId = { value: data.user_id };
    const cartItems: CartItem[] = data.items.map((item) => ({
      id: item.id,
      isbn: item.isbn,
      qty: item.qty,
      transactionType: item.transactionType,
    }));

    return new Cart(cartId, userId, cartItems);
  }

  async update(cart: Cart): Promise<Cart> {
    /**
     * transaction operation
     */

    const transaction: ClientTransaction = {
      execute: async function (
        tx: SQLiteTransaction<any, any, any, any>
      ): Promise<void> {
        const cart_data = {
          state: cart.state,
        } as any;

        const cartUpdation = tx
          .update(cartSchema)
          .set(cart_data)
          .where(eq(cartSchema.id, cart.id.value));

        const cartItemsInsertion = cart.cartItems.map((cartItem) => {
          return tx
            .insert(cartItemSchema)
            .values({
              cartId: cart.id.value,
              isbn: cartItem.isbn,
              qty: cartItem.qty,
              id: cartItem.id,
              transactionType: cartItem.transactionType,
            })
            .onConflictDoUpdate({
              target: [cartItemSchema.id, cartItemSchema.cartId],
              set: { qty: cartItem.qty },
            });
        });

        await Promise.all([...cartItemsInsertion, cartUpdation]);
      },
    };

    await executeTransaction(transaction);

    return cart;
  }

  async save(cart: Cart): Promise<Cart> {
    const transaction: ClientTransaction = {
      execute: async function (
        tx: SQLiteTransaction<any, any, any, any>
      ): Promise<void> {
        const cartData = {
          id: cart.id.value,
          user_id: cart.userId.value,
          state: cart.state,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const cartInsertion = tx.insert(cartSchema).values(cartData);

        const cartItems = cart.cartItems.map((cartItem) => {
          return {
            cartId: cart.id.value,
            isbn: cartItem.isbn,
            qty: cartItem.qty,
            id: cartItem.id,
            transactionType: cartItem.transactionType,
          };
        });

        const cartItemsInsertion = tx.insert(cartItemSchema).values(cartItems);

        await Promise.all([cartInsertion, cartItemsInsertion]);
      },
    };

    await executeTransaction(transaction);

    return cart;
  }
}

export const defaultCartRepository = new CartRepositoryImpl();
