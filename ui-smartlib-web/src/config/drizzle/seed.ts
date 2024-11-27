import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

import {
  bookCategorySchema,
  bookCopieSchema,
  bookFtagSchema,
  bookImageSchema,
  bookSchema,
  categorySchema,
  ftagsSchema,
  userSchema,
} from "./schemas";

import { db } from "./db";
import { createHashFromString } from "@/lib/utils";

async function seed() {
  try {
    const organizations: any[] = [];
    for (let i = 0; i < 10; i++) {
      const orgData = {
        name: faker.company.name(),
      };
      organizations.push(orgData);
    }

    const users: any[] = [];
    for (let i = 0; i < 10; i++) {
      const userData = {
        id: uuidv4(),
        access_id: uuidv4(),
        credential: await createHashFromString('1234'),
        is_active: faker.datatype.boolean(),
        expires_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      users.push(userData);
    }

    const ftags: any[] = [];
    for (let i = 0; i < 10; i++) {
      const ftagData = {
        id: uuidv4(),
        tagName: faker.helpers.arrayElement(["category", "sub_category"]),
        tagValue: faker.commerce.product(),
      };
      ftags.push(ftagData);
    }

    const categories: any[] = [];
    for (let i = 0; i < 10; i++) {
      const categoryData = {
        id: uuidv4(),
        name: faker.commerce.department(),
        imageUrl: faker.image.url(),
      };
      categories.push(categoryData);
    }

    const books: any[] = [];
    for (let i = 0; i < 10; i++) {
      const bookData = {
        id: uuidv4(),
        bookTitle: faker.commerce.productName(),
        editionTitle: faker.commerce.product(),
        author: faker.person.firstName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      books.push(bookData);
    }

    const bookCategoriesData = books.map((book, index) => {
      return {
        bookIsbn: book.id,
        categoryId: categories[index].id,
      };
    });

    const bookFtagsData = books.map((book, index) => {
      return {
        bookIsbn: book.id,
        ftagId: ftags[index].id,
      };
    });

    const bookImagesData = books.map((book) => {
      return {
        id: uuidv4(),
        external_id: uuidv4(),
        url: faker.image.url(),
        source_url: faker.image.url(),
        book_isbn: book.id,
        isSincronized: faker.datatype.boolean(),
      };
    });

    const bookCopiesData = books.map((book) => {
      return {
        id: uuidv4(),
        book_isbn: book.id,
        is_available: faker.datatype.boolean(),
        at_position: faker.book.series(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    });

    await Promise.all([
      db.insert(ftagsSchema).values(ftags),
      db.insert(userSchema).values(users),
      db.insert(categorySchema).values(categories),
      db.insert(bookSchema).values(books),
      db.insert(bookCategorySchema).values(bookCategoriesData),
      db.insert(bookFtagSchema).values(bookFtagsData),
      db.insert(bookImageSchema).values(bookImagesData),
      db.insert(bookCopieSchema).values(bookCopiesData),
    ]);

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding the database:", error);
  }
}

seed();
