import { Router } from "express";
import { db } from "@workspace/db";
import { categoriesTable, productsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

// GET /categories
router.get("/categories", async (req, res) => {
  const categories = await db
    .select()
    .from(categoriesTable)
    .orderBy(categoriesTable.displayOrder);
  res.json(categories);
});

// GET /categories/:id/products
router.get("/categories/:id/products", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const category = await db
    .select()
    .from(categoriesTable)
    .where(eq(categoriesTable.id, id))
    .limit(1);

  if (category.length === 0) {
    res.status(404).json({ error: "Catégorie introuvable" });
    return;
  }

  const products = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.categoryId, id));

  res.json(
    products.map((p) => ({
      ...p,
      price: parseFloat(p.price),
    })),
  );
});

export default router;
