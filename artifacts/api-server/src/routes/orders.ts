import { Router } from "express";
import { db } from "@workspace/db";
import { ordersTable, orderItemsTable, productsTable } from "@workspace/db";
import { eq, sql, gte, and } from "drizzle-orm";
import { CreateOrderBody } from "@workspace/api-zod";

const router = Router();

async function getOrderWithItems(id: number) {
  const order = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.id, id))
    .limit(1);

  if (order.length === 0) return null;

  const items = await db
    .select()
    .from(orderItemsTable)
    .where(eq(orderItemsTable.orderId, id));

  return {
    ...order[0],
    totalAmount: parseFloat(order[0].totalAmount),
    items: items.map((item) => ({
      ...item,
      unitPrice: parseFloat(item.unitPrice),
      subtotal: parseFloat(item.unitPrice) * item.quantity,
    })),
  };
}

// GET /orders
router.get("/orders", async (req, res) => {
  const { status } = req.query;

  const conditions = [];
  if (status && status !== "null") {
    conditions.push(eq(ordersTable.status, status as string));
  }

  const orders = await db
    .select()
    .from(ordersTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(ordersTable.createdAt);

  const result = await Promise.all(orders.map((o) => getOrderWithItems(o.id)));
  res.json(result.filter(Boolean));
});

// POST /orders
router.post("/orders", async (req, res) => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Données invalides", details: parsed.error.issues });
    return;
  }

  const { items } = parsed.data;

  // Fetch products to get prices and names
  const productIds = items.map((i) => i.productId);
  const products = await db
    .select()
    .from(productsTable)
    .where(sql`${productsTable.id} = ANY(${productIds})`);

  const productMap = new Map(products.map((p) => [p.id, p]));

  // Validate all products exist and are available
  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product) {
      res.status(400).json({ error: `Produit ${item.productId} introuvable` });
      return;
    }
    if (!product.available) {
      res.status(400).json({ error: `Produit ${product.name} non disponible` });
      return;
    }
  }

  // Calculate total
  let totalAmount = 0;
  for (const item of items) {
    const product = productMap.get(item.productId)!;
    totalAmount += parseFloat(product.price) * item.quantity;
  }

  // Create the order
  const [newOrder] = await db
    .insert(ordersTable)
    .values({ status: "pending", totalAmount: totalAmount.toFixed(2) })
    .returning();

  // Insert order items
  await db.insert(orderItemsTable).values(
    items.map((item) => {
      const product = productMap.get(item.productId)!;
      return {
        orderId: newOrder.id,
        productId: item.productId,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
      };
    }),
  );

  const fullOrder = await getOrderWithItems(newOrder.id);
  res.status(201).json(fullOrder);
});

// GET /orders/:id
router.get("/orders/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const order = await getOrderWithItems(id);
  if (!order) {
    res.status(404).json({ error: "Commande introuvable" });
    return;
  }

  res.json(order);
});

// PATCH /orders/:id/cancel
router.patch("/orders/:id/cancel", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const order = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.id, id))
    .limit(1);

  if (order.length === 0) {
    res.status(404).json({ error: "Commande introuvable" });
    return;
  }

  await db
    .update(ordersTable)
    .set({ status: "cancelled" })
    .where(eq(ordersTable.id, id));

  const fullOrder = await getOrderWithItems(id);
  res.json(fullOrder);
});

// GET /stats
router.get("/stats", async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayOrders = await db
    .select()
    .from(ordersTable)
    .where(gte(ordersTable.createdAt, today));

  const totalOrdersToday = todayOrders.length;
  const totalRevenueToday = todayOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + parseFloat(o.totalAmount), 0);

  const pendingOrders = todayOrders.filter((o) => o.status === "pending").length;

  // Popular items: top 5 most ordered products
  const popularRaw = await db
    .select({
      productId: orderItemsTable.productId,
      productName: orderItemsTable.productName,
      orderCount: sql<number>`cast(count(*) as int)`,
    })
    .from(orderItemsTable)
    .groupBy(orderItemsTable.productId, orderItemsTable.productName)
    .orderBy(sql`count(*) desc`)
    .limit(5);

  res.json({
    totalOrdersToday,
    totalRevenueToday,
    pendingOrders,
    popularItems: popularRaw,
  });
});

export default router;
