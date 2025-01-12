'use server'
import { cartServiceFacade } from "@/core/application";
import { LoanItemStatusDto, LoanStatusDto } from "@/core/application/dto";
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


export const onNewItemStatus = async (status: LoanItemStatusDto): Promise<any> => {

  try {
   
     return await cartServiceFacade.newLoanItemStatus(status)
    
  } catch (error) {
    console.log("error return book" + error);
    throw new Error("error return book" + error);
  }
};

export const onNewTransactionStatus = async (status: LoanStatusDto): Promise<any> => {

  try {
   
     return await cartServiceFacade.newLoanStatus(status)
    
  } catch (error) {
    throw new Error("error return book" + error);
  }
};