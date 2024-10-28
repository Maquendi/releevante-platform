import { BookEdition } from "@/book/domain/models";
import { UserId } from "@/identity/domain/models";
import { Cart } from "../domain/models";
import { BookLendingService } from "./services";


class CartServiceApiClient implements BookLendingService {

    // interact with backend api for cart initialization
    initilizeCart(userId: UserId, bookEdition: BookEdition): Promise<Cart> {
        throw new Error("Method not implemented.");
    }


    // interact with bridge.io for door/compartment opening.
    checkout(cart: Cart): Promise<Cart> {
        const compartmentsToOpen = cart.cartItems.map(item => ({compartment: item.compartment}));

        


        throw new Error("Method not implemented.");
    }
}


export const cartServiceApiClient = new CartServiceApiClient();