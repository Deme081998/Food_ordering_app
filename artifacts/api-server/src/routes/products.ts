import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router = Router();

// GET /products
router.get("/products", async (req, res) => {
  const { categoryId, available } = req.query;

  const conditions = [];
  if (categoryId !== undefined && categoryId !== null && categoryId !== "") {
    const catId = parseInt(categoryId as string, 10);
    if (!isNaN(catId)) conditions.push(eq(productsTable.categoryId, catId));
  }
  if (available !== undefined) {
    conditions.push(eq(productsTable.available, available === "true"));
  }

  const products = await db
    .select()
    .from(productsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  res.json(products.map((p) => ({ ...p, price: parseFloat(p.price) })));
});

// GET /products/:id
router.get("/products/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const product = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, id))
    .limit(1);

  if (product.length === 0) {
    res.status(404).json({ error: "Produit introuvable" });
    return;
  }

  res.json({ ...product[0], price: parseFloat(product[0].price) });
});

export default router;
