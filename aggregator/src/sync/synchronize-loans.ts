import { LibrarySyncDto } from "../model/library-sync";
const slid = process.env.slid || "";
export const synchronizeLoans = async (token: string) => {
  var requestBody: LibrarySyncDto = {
    slid: slid,
    clients: [],
  };
};
