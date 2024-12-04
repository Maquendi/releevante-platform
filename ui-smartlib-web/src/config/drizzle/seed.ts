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

    const ftags: any = [
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

    const users: any = [];
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

    const books: any = [];
    const languages = ["English", "Spanish", "French"];

    for (let i = 0; i < 20; i++) {
      const correlationId = uuidv4();
      const baseBookData = {
        bookTitle: faker.commerce.productName(),
        editionTitle: faker.commerce.product(),
        author: faker.person.firstName(),
        printLength: faker.finance.amount({ min: 0, max: 800 }),
        price: faker.commerce.price(),
        publisher: faker.book.publisher(),
        dimensions: "9.3 x 0.9 x 7.3",
        publicationDate: faker.date.anytime().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      for (const language of languages) {
        books.push({
          id: uuidv4(),
          correlationId,
          ...baseBookData,
          descriptionEn: `${language} description - ${faker.commerce.productDescription()}`,
          descriptionEs: `${language} description - ${faker.commerce.productDescription()}`,
          descriptionFr: `${language} description - ${faker.commerce.productDescription()}`,
          language,
        });
      }
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
      id: uuidv4(),
      external_id: uuidv4(),
      url: faker.image.url(),
      book_isbn: book.id,
      isSincronized: faker.datatype.boolean(),
      source_url: faker.image.url(),
    }));

    const bookCopiesData = books.map((book) => ({
      id: uuidv4(),
      book_isbn: book.id,
      is_available: faker.datatype.boolean(),
      at_position: faker.book.series(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    await db.transaction(async (tx) => {
      await Promise.all([
        tx.insert(categorySchema).values(categories).onConflictDoNothing(),
        tx.insert(ftagsSchema).values(ftags).onConflictDoNothing(),
        tx.insert(userSchema).values(users),
        tx.insert(bookSchema).values(books),
        tx.insert(bookCategorySchema).values(bookCategoriesData),
        tx.insert(bookFtagSchema).values(bookFtagsData),
        tx.insert(bookImageSchema).values(bookImagesData),
        tx.insert(bookCopieSchema).values(bookCopiesData),
      ]);
    });

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding the database:", error);
  }
}

seed();
