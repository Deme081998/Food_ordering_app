# Application de Commande de Nourriture — "L'Étoile"

Borne de commande tactile style kiosque pour restaurant. Les clients commandent seuls face à l'écran : parcourent le menu, ajoutent des plats au panier, passent commande, et reçoivent une confirmation numérotée.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — démarrer le serveur API (port 8080)
- `pnpm --filter @workspace/food-order run dev` — démarrer le frontend kiosque
- `pnpm run typecheck` — vérification TypeScript complète
- `pnpm run build` — typecheck + build tous les packages
- `pnpm --filter @workspace/api-spec run codegen` — régénérer les hooks React Query et schémas Zod depuis l'OpenAPI spec
- `pnpm --filter @workspace/db run push` — appliquer les changements de schéma DB (dev seulement)
- Required env: `DATABASE_URL` — chaîne de connexion PostgreSQL

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, TailwindCSS, Framer Motion, Wouter (routing)
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (depuis spec OpenAPI)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — contrat API (source de vérité)
- `lib/db/src/schema/` — schémas Drizzle (categories, products, orders, order_items)
- `artifacts/api-server/src/routes/` — handlers Express (categories, products, orders, health)
- `artifacts/food-order/src/pages/` — pages React (Home, Menu, Cart, Confirmation)
- `artifacts/food-order/src/context/CartContext.tsx` — état du panier (client-side)
- `lib/api-client-react/src/generated/` — hooks React Query générés (ne pas modifier)
- `lib/api-zod/src/generated/` — schémas Zod générés (ne pas modifier)

## Architecture decisions

- **Panier côté client** : le panier est géré en mémoire React (CartContext), pas persisté en base de données. Seulement lors de "Passer la commande" la commande est créée en DB.
- **Codegen post-processing** : Orval v8.23 génère `zod.int()` (API Zod v4) mais le workspace utilise Zod v3. Le script codegen dans `lib/api-spec/package.json` inclut un post-traitement `node -e` pour remplacer `zod.int()` par `zod.number().int()` après chaque génération.
- **Images produits** : les produits sans `image_url` en base utilisent des images générées par le design subagent selon leur catégorie.
- **Kiosque tactile** : UI pensée pour grand écran tactile — boutons ≥60px, texte ≥18px, zones de tap généreuses.

## Product

- **Page d'accueil** : image plein écran immersive, click n'importe où pour démarrer
- **Choix d'action** : boutons "Commander" et "Abandonner" avec confirmation d'abandon
- **Menu** : 3 onglets (Plats, Desserts, Jus) avec grille de produits, panier flottant
- **Panier** : révision des articles avec +/- quantités, total, passage à la commande
- **Confirmation** : numéro de commande, compte à rebours retour accueil

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Après chaque modification de `lib/api-spec/openapi.yaml`, relancer `pnpm --filter @workspace/api-spec run codegen` avant tout usage des hooks générés.
- Le post-traitement `zod.int()` → `zod.number().int()` est dans `lib/api-spec/package.json` script "codegen" : ne pas le supprimer si Orval est mis à jour.
- Ne pas appeler `configureWorkflow` pour les services artifact — les workflows managés fournissent PORT, BASE_PATH et le routing proxy.

## Pointers

- Voir la skill `pnpm-workspace` pour la structure du workspace, le setup TypeScript, et les détails des packages
