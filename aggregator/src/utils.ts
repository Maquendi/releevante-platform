import { Book } from "./model/client";

export const arrayGroupBy = function (xs: any[], key: string) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};


export interface Grouped {
    key: string
}


export function arrayGroupByV2(books: Book[], keyFn: (item: Book)=> string) {
  return books.reduce((result, item) => {
    const key = keyFn(item); // Determine the group key
    if (!result[key]) {
      result[key] = []; // Initialize the group if it doesn't exist
    }
    result[key].push(item); // Add the item to the group
    return result;
  }, {} as any);
}

