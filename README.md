# Food_ordering_app
Une application complète de commande de nourriture avec :
un menu par catégories, un panier, la gestion des commandes, et une base de données PostgreSQL pour persister toutes les données.

Flux de navigation complet :

Accueil — image plein écran immersive, "Touchez l'écran pour commencer"
Choix — deux grands boutons tactiles : "Commander" et "Abandonner" (avec confirmation)
Menu — 3 onglets (Plats, Desserts, Jus)
Panier — liste des articles avec +/−, sous-totaux, bouton de passage à la commande
Confirmation — numéro de commande + retour automatique à l'accueil
Base de données PostgreSQL avec 4 tables : categories, products, orders, order_items.

Toutes les commandes passées sont persistées.
