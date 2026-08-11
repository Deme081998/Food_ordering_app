import { db, categoriesTable, productsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

async function getOrCreateCategory(name: string, icon: string, displayOrder: number) {
  const existing = await db
    .select()
    .from(categoriesTable)
    .where(eq(categoriesTable.name, name))
    .limit(1);

  if (existing.length > 0) {
    console.log(`Catégorie "${name}" déjà existante, réutilisation.`);
    return existing[0];
  }

  const [created] = await db
    .insert(categoriesTable)
    .values({ name, icon, displayOrder })
    .returning();

  console.log(`Catégorie "${name}" créée.`);
  return created;
}

async function upsertProduct(product: {
  categoryId: number;
  name: string;
  description: string;
  price: string;
  available: boolean;
}) {
  const existing = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.name, product.name))
    .limit(1);

  if (existing.length > 0) {
    console.log(`Produit "${product.name}" déjà existant, ignoré.`);
    return;
  }

  await db.insert(productsTable).values(product);
  console.log(`Produit "${product.name}" ajouté.`);
}

async function seed() {
  console.log("Seeding database...");

  const plats = await getOrCreateCategory("Plats", "utensils", 1);
  const desserts = await getOrCreateCategory("Desserts", "cake", 2);
  const jus = await getOrCreateCategory("Jus", "cup-soda", 3);

  const products = [
    // Catégorie Plats
    { categoryId: plats.id, name: "Thiébou guinaar", description: "Poulet aux épices africaines, servi avec des œufs, du riz et des légumes.", price: "12.50", available: true },
    { categoryId: plats.id, name: "Thiébou dieune", description: "Riz au poisson sénégalais servi avec des légumes.", price: "13.00", available: true },
    { categoryId: plats.id, name: "Thiébou diaga", description: "Riz au poisson avec légumes, boulettes.", price: "12.50", available: true },
    { categoryId: plats.id, name: "Thiébou yapp", description: "Riz à la viande servi avec des œufs, légumes.", price: "12.50", available: true },
    { categoryId: plats.id, name: "Domoda yapp", description: "Riz à la viande, spécialité sénégalaise.", price: "12.50", available: true },
    { categoryId: plats.id, name: "Yassa guinaar", description: "Riz au poulet.", price: "12.50", available: true },
    { categoryId: plats.id, name: "Salade composée", description: "Salade, viande, tomate", price: "12.50", available: true },
    { categoryId: plats.id, name: "Couscous guinaar", description: "Couscous au poulet", price: "12.50", available: true },
    { categoryId: plats.id, name: "Fataya", description: "Fataya au poulet", price: "10.50", available: true },

    // Catégorie Desserts
    { categoryId: desserts.id, name: "Thiakry", description: "Dessert à base de mil, yaourt et vanille.", price: "8.50", available: true },
    { categoryId: desserts.id, name: "Lakh sow", description: "Dessert à base de granulés de mil cuits (sankhal), crème onctueuse à base de lait caillé, de sucre et d'arômes.", price: "8.50", available: true },
    { categoryId: desserts.id, name: "Lakh neuteri", description: "Dessert à base de granulés de mil cuits (sankhal), avec une crème onctueuse à base de ngalakh, de sucre et d'arômes.", price: "8.50", available: true },
    { categoryId: desserts.id, name: "Riz au lait", description: "Dessert à base de riz, avec du lait.", price: "8.50", available: true },

    // Catégorie Jus
    { categoryId: jus.id, name: "Bissap", description: "Jus d'hibiscus frais et sucré.", price: "6.00", available: true },
    { categoryId: jus.id, name: "Bouye", description: "Jus de pain de singe, onctueux et rafraîchissant.", price: "6.00", available: true },
    { categoryId: jus.id, name: "Raisin", description: "Jus de raisin naturel.", price: "6.00", available: true },
    { categoryId: jus.id, name: "Fraise", description: "Jus de Fraise.", price: "6.00", available: true },
    { categoryId: jus.id, name: "Mangue", description: "Jus de Mangue.", price: "6.00", available: true },
    { categoryId: jus.id, name: "Orange", description: "Jus d'Orange.", price: "6.00", available: true },
    { categoryId: jus.id, name: "Citron", description: "Jus de Citron.", price: "6.00", available: true },
    { categoryId: jus.id, name: "Pomme", description: "Jus de Pomme.", price: "6.00", available: true },
    { categoryId: jus.id, name: "Ananas", description: "Jus d'Ananas.", price: "6.00", available: true },
    { categoryId: jus.id, name: "Goyave", description: "Jus de Goyave.", price: "6.00", available: true },
    { categoryId: jus.id, name: "Gingembre", description: "Jus de Gingembre.", price: "6.00", available: true },
    { categoryId: jus.id, name: "Pastèque", description: "Jus de Pastèque.", price: "6.00", available: true },
    { categoryId: jus.id, name: "Poire", description: "Jus de Poire.", price: "6.00", available: true },
    { categoryId: jus.id, name: "Melon", description: "Jus de Melon.", price: "6.00", available: true },
    { categoryId: jus.id, name: "Banane", description: "Jus de Banane.", price: "6.00", available: true },
    { categoryId: jus.id, name: "Kiwi", description: "Jus de kiwi.", price: "6.00", available: true },
  ];

  for (const product of products) {
    await upsertProduct(product);
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});