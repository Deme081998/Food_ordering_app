import { db, categoriesTable, productsTable } from "@workspace/db";

async function seed() {
  console.log("Seeding database...");

  const [plats, desserts, jus] = await db
    .insert(categoriesTable)
    .values([
      { name: "Plats", icon: "utensils", displayOrder: 1 },
      { name: "Desserts", icon: "cake", displayOrder: 2 },
      { name: "Jus", icon: "cup-soda", displayOrder: 3 },
    ])
    .returning();

  await db.insert(productsTable).values([
    
    // Catégorie Plats
    {
      categoryId: plats.id,
      name: "Thiébou guinaar",
      description: "Poulet aux épices africaines, servi avec des œufs, du riz et des légumes.",
      price: "12.50",
      available: true,
    },
    {
      categoryId: plats.id,
      name: "Thiébou dieune",'Thiébou diaga', 16, 'riz, poisson, légumes, boulette', 
      description: "Riz au poisson sénégalais servi avec des légumes.",
      price: "13.00",
      available: true,
    },
    {
      categoryId: plats.id,
      name: "Thiébou diaga",
      description: "Riz au poisson avec légumes, boulettes.",
      price: "12.50",
      available: true,
    },
    {
      categoryId: plats.id,
      name: "Thiébou yapp",
      description: "Riz à la viande servi avec des œufs, légumes.",
      price: "12.50",
      available: true,
    },
    {
      categoryId: plats.id,
      name: "Domoda yapp",
      description: "Riz à la viande, spécialité sénégalaise.",
      price: "12.50",
      available: true,
    },
    {
      categoryId: plats.id,
      name: "Yassa guinaar",
      description: "Riz au poulet.",
      price: "12.50",
      available: true,
    },
    {
      categoryId: plats.id,
      name: "Salade composée",
      description: "Salade, viande, tomate",
      price: "12.50",
      available: true,
    },
    {
      categoryId: plats.id,
      name: "Couscous guinaar",
      description: "Couscous au poulet",
      price: "12.50",
      available: true,
    },
    {
      categoryId: plats.id,
      name: "Fataya",
      description: "Fataya au poulet",
      price: "10.50",
      available: true,
    },

    // Catégorie Desserts
    {
      categoryId: desserts.id,
      name: "Thiakry",
      description: "Dessert à base de mil, yaourt et vanille.",
      price: "8.50",
      available: true,
    },
    {
      categoryId: desserts.id,
      name: "Lakh sow",
      description: "Dessert à base de granulés de mil cuits (sankhal), crème onctueuse à base de lait caillé, de sucre et d'arômes.",
      price: "8.50",
      available: true,
    },
    {
      categoryId: desserts.id,
      name: "Lakh neuteri",
      description: "Dessert à base de granulés de mil cuits (sankhal), avec une crème onctueuse à base de ngalakh, de sucre et d'arômes.",
      price: "8.50",
      available: true,
    },
    {
      categoryId: desserts.id,
      name: "Riz au lait",
      description: "Dessert à base de riz, avec du lait.",
      price: "8.50",
      available: true,
    },

    // Catégorie Jus
    {
      categoryId: jus.id,
      name: "Bissap",
      description: "Jus d'hibiscus frais et sucré.",
      price: "6.00",
      available: true,
    },
    {
      categoryId: jus.id,
      name: "Bouye",
      description: "Jus de pain de singe, onctueux et rafraîchissant.",
      price: "6.00",
      available: true,
    },
    {
        categoryId: jus.id,
        name: "Raisin",
        description: "Jus de pain de raisin naturel.",
        price: "6.00",
        available: true,
      },
      {
        categoryId: jus.id,
        name: "Fraise",
        description: "Jus de Fraise.",
        price: "6.00",
        available: true,
      },
      {
        categoryId: jus.id,
        name: "Mangue",
        description: "Jus de Mangue.",
        price: "6.00",
        available: true,
      },
      {
        categoryId: jus.id,
        name: "Orange",
        description: "Jus d'Orange.",
        price: "6.00",
        available: true,
      },
      {
        categoryId: jus.id,
        name: "Citron",
        description: "Jus de Citron.",
        price: "6.00",
        available: true,
      },
      {
        categoryId: jus.id,
        name: "Pomme",
        description: "Jus de Pomme.",
        price: "6.00",
        available: true,
      },
      {
        categoryId: jus.id,
        name: "Ananas",
        description: "Jus d'Ananas.",
        price: "6.00",
        available: true,
      },
      {
        categoryId: jus.id,
        name: "Goyave",
        description: "Jus de Goyave.",
        price: "6.00",
        available: true,
      },
      {
        categoryId: jus.id,
        name: "Gingembre",
        description: "Jus de Gingembre.",
        price: "6.00",
        available: true,
      },
      {
        categoryId: jus.id,
        name: "Pastèque",
        description: "Jus de Pastèque.",
        price: "6.00",
        available: true,
      },
      {
        categoryId: jus.id,
        name: "Poire",
        description: "Jus de Poire.",
        price: "6.00",
        available: true,
      },
      {
        categoryId: jus.id,
        name: "Melon",
        description: "Jus de Melon.",
        price: "6.00",
        available: true,
      },
      {
        categoryId: jus.id,
        name: "Banane",
        description: "Jus de Banane.",
        price: "6.00",
        available: true,
      },
      {
        categoryId: jus.id,
        name: "Kiwi",
        description: "Jus de kiwi.",
        price: "6.00",
        available: true,
      },
  ]);

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});