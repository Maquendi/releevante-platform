import mockBooks from "../config/mockbooks.json";

export function FetchBookByCategory(categoryId?: string) {
  const groupedBooks: { [key: string]: any } = {};

  mockBooks.json.forEach(({ subCategories, ...book }) => {
    subCategories.forEach((subCat) => {
      const subCategoryId = subCat.id || "";
      if (!groupedBooks[subCategoryId]) {
        groupedBooks[subCategoryId] = {
          subCategory: subCat,
          books: [],
          bookIds: new Set(),
        };
      }

      if (!groupedBooks[subCategoryId].bookIds.has(book.id)) {
        groupedBooks[subCategoryId].books.push(book);
        groupedBooks[subCategoryId].bookIds.add(book.id);
      }
    });
  });

  const resultData = Object.values(groupedBooks).map(
    ({ bookIds, ...rest }) => rest
  );

  if (!categoryId) return resultData;

  return resultData
    .map((group) => ({
      subCategory: group.subCategory,
      books: group.books.filter((book: any) =>
        book.categories.some((category: any) => category.id === categoryId)
      ),
    }))
    .filter((group) => group.books.length > 0);
}

export async function FetchAllBookCategories():Promise<any[]> {
  const allCategories = mockBooks.json.reduce((acc, book) => {
    book.categories.forEach((item) => {
      if (!acc[item.id]) {
        acc[item.id] = item;
      }
    });
    return acc;
  }, {});

  return  Object.values(allCategories) as any[]
}
