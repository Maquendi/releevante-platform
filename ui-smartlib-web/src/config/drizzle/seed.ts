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
    const categories = [
      {
        id: "1b50d2a2-8c3d-4b1e-b3e6-dc9c9d5f763a",
        enName: "Mystery",
        frName: "Mystère",
        esName: "Misterio",
      },
      {
        id: "2a72d3a2-9e4d-5c2f-c3f7-ed0d9e6f874b",
        enName: "Romance",
        frName: "Romantique",
        esName: "Romance",
      },
      {
        id: "3c83e4b2-af5e-6d3f-d4f8-fe1eae7f985c",
        enName: "Adventure",
        frName: "Aventure",
        esName: "Aventura",
      },
      {
        id: "4d94f5c3-bf6f-7e4f-e5f9-0f2fbf8fa96d",
        enName: "Thriller",
        frName: "Thriller",
        esName: "Suspenso",
      },
      {
        id: "03cc5e3e-c6e9-474e-8780-84094ed2deee",
        enName: "Fantasy",
        frName: "Fantaisie",
        esName: "Fantasía",
      },
      {
        id: "5e466399-87be-4447-b808-834bba6941ee",
        enName: "Growth",
        frName: "Croissance",
        esName: "Crecimiento",
      },
    ];
    

    const ftags:any = [
      {
        id: "5e05g6d4-cf7g-8f5g-f6ga-1g3gcg9g107d",
        tagName: "sub_category",
        enTagValue: "Best sellers",
        frTagValue: "Meilleures ventes",
        esTagValue: "Más vendidos",
      },
      {
        id: "6f16h7e5-dg8h-9g6h-g7hb-2h4hdh0h218e",
        tagName: "sub_category",
        enTagValue: "Trendy",
        frTagValue: "À la mode",
        esTagValue: "De moda",
      },
      {
        id: "7g27i8f6-eh9i-0h7i-h8ic-3i5iei1i329f",
        tagName: "sub_category",
        enTagValue: "Popular",
        frTagValue: "Populaire",
        esTagValue: "Popular",
      },
      {
        id: "8h38j9g7-fi0j-1i8j-i9jd-4j6jfj2j43ag",
        tagName: "sub_category",
        enTagValue: "Most used",
        frTagValue: "Le plus utilisé",
        esTagValue: "Más usado",
      },
    ];
    

    const users:any = [];
    for (let i = 0; i < 10; i++) {
      users.push({
        id: uuidv4(),
        access_id: uuidv4(),
        credential: await createHashFromString("1234"),
        is_active: faker.datatype.boolean(),
        expires_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    const books:any = [];
    for (let i = 0; i < 20; i++) {
      books.push({
        id: uuidv4(),
        bookTitle: faker.commerce.productName(),
        editionTitle: faker.commerce.product(),
        author: faker.person.firstName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    const bookCategoriesData = books.map((book) => ({
      bookIsbn: book.id,
      categoryId: categories[Math.floor(Math.random() * categories.length)].id,
    }));

    const bookFtagsData = books.map((book) => ({
      bookIsbn: book.id,
      ftagId: ftags[Math.floor(Math.random() * ftags.length)].id,
    }));

    const bookImagesData = books.map((book) => ({
      external_id: uuidv4(),
      url: faker.image.url(),
      book_isbn: book.id,
      isSincronized: faker.datatype.boolean(),
    }));

    const bookCopiesData = books.map((book) => ({
      id: uuidv4(),
      book_isbn: book.id,
      is_available: faker.datatype.boolean(),
      at_position: faker.book.series(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    await Promise.all([
      db.insert(categorySchema).values(categories).onConflictDoNothing(),
      db.insert(ftagsSchema).values(ftags).onConflictDoNothing(),
      db.insert(userSchema).values(users),
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
