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
    {
      categoryId: plats.id,
      name: "Poulet Braisé",
      description: "Poulet entier braisé aux épices africaines, servi avec du riz et des légumes.",
      price: "12.50",
      available: true,
    },
    {
      categoryId: plats.id,
      name: "Thiéboudienne",
      description: "Riz au poisson sénégalais, spécialité de la maison avec légumes frais.",
      price: "13.00",
      available: true,
    },
    {
      categoryId: desserts.id,
      name: "Thiakry",
      description: "Dessert à base de mil, yaourt et vanille.",
      price: "5.00",
      available: true,
    },
    {
      categoryId: jus.id,
      name: "Bissap",
      description: "Jus d'hibiscus frais et sucré.",
      price: "3.50",
      available: true,
    },
    {
      categoryId: jus.id,
      name: "Jus de Bouye",
      description: "Jus de pain de singe, onctueux et rafraîchissant.",
      price: "3.50",
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