import { dbConnection } from "../config/db";
import { executePost } from "../htttp-client/http-client";
import { ApiRequest, ApiResponse } from "../htttp-client/model";
import { LibrarySyncDto, LibrarySyncResponse } from "../model/library-sync";
import { arrayGroupinBy } from "../utils";
const slid = process.env.slid || "";

export const synchronizeLoans = async (token: string) => {
  let recordsUploaded = await createLoans(token);

  recordsUploaded += await createLoanStatuses(token);
};

async function createLoanStatuses(token: string): Promise<number> {
  const loanStatusDto = dbConnection
    .prepare(
      `select ls.*, ls.user_id, bl.external_id  from loan_status ls inner join book_loans bl on bl.id=ls.loan_id where ls.is_synced = false`
    )
    .all()
    .map((status: any) => {
      return {
        clientId: status.client_id,
        loanId: status.loan_id,
        id: status.id,
        status: status.status,
        createdAt: status.created_at,
        isLoanStatus: true,
        externalId: status.external_id,
      };
    });

  dbConnection
    .prepare(
      `select lis.*, li.loan_id, bl.user_id, lb.external_id from loan_item_status lis inner join loan_items li on li.id=lis.item_id inner join book_loans bl on bl.id=li.loan_id where lis.is_synced = false`
    )
    .all()
    .forEach((itemStatus: any) => {
      var status: any = {
        clientId: itemStatus.client_id,
        loanId: itemStatus.loan_id,
        id: itemStatus.id,
        status: itemStatus.status,
        createdAt: itemStatus.created_at,
        itemId: itemStatus.item_id,
        isLoanStatus: false,
        externalId: status.external_id,
      };
      loanStatusDto.push(status);
    });

  let loanStatusGroups = arrayGroupinBy(loanStatusDto, "loanId");

  const clients = Object.keys(loanStatusGroups).map((loanId) => {
    const all = loanStatusGroups[loanId][0];
    const sample = all[0];

    const loanStatuses = all
      .filter((item: any) => item.isLoanStatus)
      .map((item: any) => ({
        id: item.id,
        status: item.status,
        createdAt: item.createdAt,
      }));

    //const loanItemStatuses = all.filter((item: any) => !item.isLoanStatus);

    const loanItemGroups = arrayGroupinBy(
      all.filter((item: any) => !item.isLoanStatus),
      "itemId"
    );

    const itemStatuses = Object.keys(loanItemGroups).flatMap((itemId) => {
      const allItem = loanItemGroups[itemId];
      return allItem.map((item: any) => ({
        id: item.id,
        status: item.status,
        createdAt: item.createdAt,
      }));
    });

    return {
      id: sample.clientId,
      loan: {
        id: sample.loanId,
        externalId: sample.externalId,
        status: loanStatuses as any[],
        items: itemStatuses,
      },
    };
  });

  if (clients.length == 0) {
    return 0;
  }

  const response = await callApi(token, {
    slid: slid,
    clients,
  });

  if (response.statusCode == 200) {
    Object.keys(loanStatusGroups).map((key) => {
      const statuses = loanStatusGroups[key];

      statuses
        .filter((status: any) => status.isLoanStatus)
        .forEach((status: any) => {
          dbConnection
            .prepare(
              `UPDATE loan_status SET is_synced=true where id=${status.id}`
            )
            .run().changes;
        });

      statuses
        .filter((status: any) => !status.isLoanStatus)
        .forEach((status: any) => {
          dbConnection
            .prepare(
              `UPDATE loan_item_status SET is_synced=true where id=${status.id}`
            )
            .run().changes;
        });
    });

    return loanStatusDto.length;
  }

  return 0;
}

async function createLoans(token: string): Promise<number> {
  const loans = dbConnection
    .prepare(`select * from book_loans where external_id is null`)
    .all();

  console.log(loans);

  const clients = loans.map((loan: any) => {
    const loanId = loan.id;

    const loanStatusDto = dbConnection
      .prepare(`select * from loan_status where loan_id = ?`)
      .all(loanId)
      .map((status: any) => {
        return {
          id: status.id,
          status: status.status,
          createdAt: status.created_at,
        };
      });

    const loanItemsDto = dbConnection
      .prepare(`select * from loan_items where loan_id = ?`)
      .all(loanId)
      .map((loanItem: any) => {
        const itemId = loanItem.id;

        const loanItemStatuses = dbConnection
          .prepare(`select * from loan_item_status where item_id = ?`)
          .all(itemId)
          .map((itemStatus: any) => {
            return {
              id: itemStatus.id,
              status: itemStatus.status,
              createdAt: itemStatus.created_at,
            };
          });

        return {
          id: itemId,
          cpy: loanItem.book_copy_id,
          statuses: loanItemStatuses,
        };
      });

    const loanDto = {
      externalId: loanId,
      returnsAt: loan.returns_at,
      createdAt: loan.created_at,
      status: loanStatusDto,
      items: loanItemsDto,
    };
    return {
      id: loan.user_id,
      loan: loanDto,
    };
  });

  if (clients.length == 0) {
    return 0;
  }

  var requestBody: LibrarySyncDto = {
    slid: slid,
    clients,
  };

  const response = await callApi(token, requestBody);

  if (response.statusCode == 200) {
    const syncResponse = response.context.data;

    syncResponse.clients.forEach((client) => {
      client.loans.forEach((loan) => {
        const stmt = dbConnection.prepare(
          `UPDATE book_loans SET external_id=? where id=?`
        );

        return stmt.run({ external_id: loan.exteralId, id: loan.id }).changes;
      });
    });

    return clients.length;
  }

  return 0;
}

async function callApi(
  token: string,
  body: LibrarySyncDto
): Promise<ApiResponse<LibrarySyncResponse>> {
  const request: ApiRequest = {
    token,
    resource: `sl/${slid}/loans`,
    body,
  };

  return executePost<LibrarySyncResponse>(request);
}
