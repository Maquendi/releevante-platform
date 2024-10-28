import { BookEdition } from "@/book/domain/models";
import { UserId } from "@/identity/domain/models";
import { Cart } from "../domain/models";
import { CartService } from "./services";


class CartServiceApiGateway implements CartService {

    initilizeCart(userId: UserId, bookEdition: BookEdition): Promise<Cart> {
        throw new Error("Method not implemented.");
    }



    checkout(cart: Cart): Promise<Cart> {
        throw new Error("Method not implemented.");
    }
}