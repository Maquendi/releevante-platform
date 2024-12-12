import { dbConnection } from "../config/db";
import { LibrarySyncDto } from "../model/library-sync";
const slid = process.env.slid || "";
export const synchronizeLoans = async (token: string) => {
  var requestBody: LibrarySyncDto = {
    slid: slid,
    clients: [],
  };

  const loans = dbConnection
    .prepare(
      `
    select * from book_loans
    `
    )
    .all();

  console.log(loans);

  loans.map((loan: any) => {

    const client = {
      id: loan.user_id
    }

    const loanId = loan.id;

    const loanStatuses = dbConnection
      .prepare(`select * from loan_status where loan_id = ?`)
      .all(loanId);

    const loanItems = dbConnection
      .prepare(`select * from loan_items where loan_id = ?`)
      .all(loanId);

    console.log(loanItems);

    console.log(loanStatuses);

    loanItems.map((loanItem: any) => {
      const itemId = loanItem.id;
      const loanItemStatuses = dbConnection
        .prepare(`select * from loan_item_status where item_id = ?`)
        .all(itemId);
    });
  });
};
