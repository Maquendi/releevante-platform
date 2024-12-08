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

const subCategoriesftags: any = [
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

const readingVibesftags: any = [
  {
    id: "b1f8ddea-d1a6-4f57-8ec9-9e6c4d8e1e25",
    tagName: "reading_vibe",
    enTagValue: "i want to be entertained",
    frTagValue: "je veux être diverti",
    esTagValue: "quiero entretenerme",
  },
  {
    id: "d4b1fcd8-ece3-44b8-8eaf-914d2d4a8bc3",
    tagName: "reading_vibe",
    enTagValue: "something relaxing",
    frTagValue: "quelque chose de relaxant",
    esTagValue: "algo relajante",
  },
  {
    id: "8438bf6e-320b-4319-8f04-c0e7fa3d46fc",
    tagName: "reading_vibe",
    enTagValue: "take me on an adventure",
    frTagValue: "emmenez-moi à l'aventure",
    esTagValue: "llévame a una aventura",
  },
  {
    id: "94e18c60-4d60-4b25-81d1-bccf8036e8de",
    tagName: "reading_vibe",
    enTagValue: "teach me something new",
    frTagValue: "apprenez-moi quelque chose de nouveau",
    esTagValue: "enséñame algo nuevo",
  },
  {
    id: "93c82c5f-e376-4721-a3be-7a36b6c63d55",
    tagName: "reading_vibe",
    enTagValue: "i’m here for feels - romance, tears, all of it",
    frTagValue: "je suis ici pour les émotions - romance, larmes, tout ça",
    esTagValue: "estoy aquí por las emociones - romance, lágrimas, todo eso",
  },
  {
    id: "cb1c5eeb-fb7f-4564-8c69-d2cf8d153f49",
    tagName: "reading_vibe",
    enTagValue: "i love a good mystery or some thrilling",
    frTagValue: "j'adore un bon mystère ou quelque chose de palpitant",
    esTagValue: "me encanta un buen misterio o algo emocionante",
  },
];

const moodVibesftags: any = [
  {
    id: "05a4c73f-c18d-4939-a77b-4b9ac3cc7986",
    tagName: "mood_vibe",
    enTagValue: "lighthearted and fun",
    frTagValue: "ludique et amusant",
    esTagValue: "alegre y divertido",
  },
  {
    id: "b3e8d6f7-4314-4a0a-bdf3-2022c39143eb",
    tagName: "mood_vibe",
    enTagValue: "romantic and swoon-worthy",
    frTagValue: "romantique et à tomber",
    esTagValue: "romántico y digno de desmayo",
  },
  {
    id: "a8f63c0d-09bb-4ad6-8767-96f99ef88801",
    tagName: "mood_vibe",
    enTagValue: "suspenseful and full of twists",
    frTagValue: "plein de suspense et de rebondissements",
    esTagValue: "lleno de suspenso y giros",
  },
  {
    id: "68178b72-d284-4370-9f88-c17b5f5a4f8c",
    tagName: "mood_vibe",
    enTagValue: "magical and enchanting",
    frTagValue: "magique et enchanteur",
    esTagValue: "mágico y encantador",
  },
  {
    id: "9e66a062-dbe2-456e-94f2-ef65ef28e60d",
    tagName: "mood_vibe",
    enTagValue: "adventurous and daring",
    frTagValue: "aventureux et audacieux",
    esTagValue: "aventurero y atrevido",
  },
  {
    id: "4be3aafd-d3dc-4c46-9122-9d5e0f70cbbc",
    tagName: "mood_vibe",
    enTagValue: "cozy and nostalgic",
    frTagValue: "confortable et nostalgique",
    esTagValue: "acogedor y nostálgico",
  },
  {
    id: "bcb7c42b-8cf1-4b26-9515-cf2f94e7f2d4",
    tagName: "mood_vibe",
    enTagValue: "thoughtful and inspiring",
    frTagValue: "réfléchi et inspirant",
    esTagValue: "reflexivo e inspirador",
  },
  {
    id: "6f0206e5-5b98-4355-b9c8-68f6b1538eb9",
    tagName: "mood_vibe",
    enTagValue: "spine-tingling and eerie",
    frTagValue: "frissonnant et étrange",
    esTagValue: "escalofriante y espeluznante",
  },
  {
    id: "ecbb1452-2267-4c3c-b1df-c5128a7f5b0d",
    tagName: "mood_vibe",
    enTagValue: "growing in $$",
    frTagValue: "croissant en $$",
    esTagValue: "creciendo en $$",
  },
];

const flavorStoryVibesftags:any = [
  {
    id: "fbbd3d38-906f-4b80-9a85-cc295a3fbc76",
    tagName: "flavor_story_vibe",
    enTagValue: "sci-fi: to the stars and beyond",
    frTagValue: "science-fiction : vers les étoiles et au-delà",
    esTagValue: "ciencia ficción: a las estrellas y más allá",
  },
  {
    id: "62cf9486-e7b0-4b4b-bce6-8e6c013d70b4",
    tagName: "flavor_story_vibe",
    enTagValue: "fantasy: dragon, magic, etc",
    frTagValue: "fantastique : dragon, magie, etc",
    esTagValue: "fantasía: dragón, magia, etc",
  },
  {
    id: "d62d84f0-1060-46d9-b37c-df8477a693a1",
    tagName: "flavor_story_vibe",
    enTagValue: "mystery/thriller: who did it? need answers",
    frTagValue: "mystère/thriller : qui l'a fait ? besoin de réponses",
    esTagValue: "misterio/suspenso: ¿quién lo hizo? necesito respuestas",
  },
  {
    id: "c84d8303-6d04-4f99-9f7d-4e5374c8b198",
    tagName: "flavor_story_vibe",
    enTagValue: "romance: sparks flying!",
    frTagValue: "romance : des étincelles qui volent !",
    esTagValue: "romance: ¡chispas volando!",
  },
  {
    id: "15a41357-0d6b-4297-b2f1-717b68449ab7",
    tagName: "flavor_story_vibe",
    enTagValue: "drama: deep emotions, please",
    frTagValue: "drame : des émotions profondes, s'il vous plaît",
    esTagValue: "drama: emociones profundas, por favor",
  },
  {
    id: "17f1d708-e16f-4bb9-9c3d-205d61604177",
    tagName: "flavor_story_vibe",
    enTagValue: "historical fiction: step back in time",
    frTagValue: "fiction historique : remontez le temps",
    esTagValue: "ficción histórica: retrocede en el tiempo",
  },
  {
    id: "8a3d5f3a-bf8f-44c5-b84d-b1a2e69e7451",
    tagName: "flavor_story_vibe",
    enTagValue: "non-fiction: real stories, real facts, money",
    frTagValue: "non-fiction : histoires vraies, faits réels, argent",
    esTagValue: "no ficción: historias reales, hechos reales, dinero",
  },
  {
    id: "9e2e350e-dca6-40b9-93be-bfc06051bc75",
    tagName: "flavor_story_vibe",
    enTagValue: "surprise me",
    frTagValue: "surprenez-moi",
    esTagValue: "sorpréndeme",
  },
];


const ftags=[...subCategoriesftags,...readingVibesftags,...moodVibesftags,...flavorStoryVibesftags]

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

async function seed() {
  try {
   
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
        tx.insert(bookImageSchema).values(bookImagesData),
        tx.insert(bookCopieSchema).values(bookCopiesData),
        tx.insert(bookFtagSchema).values(bookFtagsData),
      ]);
    });


    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding the database:", error);
  }
}

seed();
