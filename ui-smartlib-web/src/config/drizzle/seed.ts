const faker = require("@faker-js/faker").faker;
const { v4: uuidv4 } = require("uuid");

const {
  bookCategorySchema,
  bookCopieSchema,
  bookFtagSchema,
  bookImageSchema,
  bookSchema,
  categorySchema,
  ftagsSchema,
  organizationSchema,
  userSchema,
} = require("./schemas");

const { db } = require("./db");

async function seed() {
  try {
    const organizations = [];
    for (let i = 0; i < 10; i++) {
      const orgData = {
        name: faker.company.name(),
      };
      organizations.push(orgData);
    }

    const users = [];
    for (let i = 0; i < 10; i++) {
      const userData = {
        id: uuidv4(),
        pin: faker.finance.routingNumber(),
        is_active: faker.datatype.boolean(),
        organization_id: uuidv4(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      users.push(userData);
    }

    const ftags = [];
    for (let i = 0; i < 10; i++) {
      const ftagData = {
        id: uuidv4(),
        tagName: faker.helpers.arrayElement(["category", "sub_category"]),
        tagValue: faker.commerce.product(),
      };
      ftags.push(ftagData);
    }

    const categories = [];
    for (let i = 0; i < 10; i++) {
      const categoryData = {
        id: uuidv4(),
        name: faker.commerce.department(),
        imageUrl:faker.image.url()
      };
      categories.push(categoryData);
    }

    const books = [];
    for (let i = 0; i < 10; i++) {
      const bookData = {
        isbn: uuidv4(),
        bookTitle: faker.commerce.productName(),
        editionTitle: faker.commerce.product(),
        author: faker.person.firstName(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      books.push(bookData);
    }

    const bookCategoriesData = books.map((book, index) => {
      return {
        bookIsbn: book.isbn,
        categoryId: categories[index].id,
      };
    });

    const bookFtagsData = books.map((book, index) => {
      return {
        bookIsbn: book.isbn,
        ftagId: ftags[index].id,
      };
    });

    const bookImagesData = books.map((book) => {
      return {
        url: faker.image.url(),
        book_isbn: book.isbn,
        isSincronized: faker.datatype.boolean(),
      };
    });

    const bookCopiesData = books.map((book) => {
      return {
        book_isbn: book.isbn,
        is_available: faker.datatype.boolean(),
        at_position: faker.book.series(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    });

    await Promise.all([
      db.insert(organizationSchema).values(organizations),
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
