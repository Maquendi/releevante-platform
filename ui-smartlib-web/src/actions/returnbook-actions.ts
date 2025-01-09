'use server'
import { cartServiceFacade } from "@/core/application";
import { ReturnBook } from "@/redux/features/returnbookSlice";

export const returnSingleBook = async (loanItem: ReturnBook): Promise<any> => {

  try {
   
     return await cartServiceFacade.newLoanItemStatus({
        itemId:loanItem.itemId,
        status:'RETURNED'
    })
    
  } catch (error) {
    console.log("error return book" + error);
    throw new Error("error return book" + error);
  }
};