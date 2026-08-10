import React, { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { useListCategories, useListProducts } from '@workspace/api-client-react';
import { useCart } from '@/context/CartContext';
import platPlaceholder from '@assets/generated_images/plat.jpg';
import dessertPlaceholder from '@assets/generated_images/dessert.jpg';
import drinkPlaceholder from '@assets/generated_images/drink.jpg';
import { ShoppingCart, Plus, ArrowLeft } from 'lucide-react';

const getPlaceholderImage = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes('dessert')) return dessertPlaceholder;
  if (name.includes('jus') || name.includes('boisson')) return drinkPlaceholder;
  return platPlaceholder;
};

export default function Menu() {
  const [_, setLocation] = useLocation();
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  
  const { data: categoriesRaw, isLoading: isLoadingCategories } = useListCategories();
  const { data: productsRaw, isLoading: isLoadingProducts } = useListProducts();
  const categories = categoriesRaw ?? [];
  const products = productsRaw ?? [];
  const { items, addItem, totalItems, totalPrice } = useCart();

  // Sort categories by displayOrder
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => a.displayOrder - b.displayOrder);
  }, [categories]);

  // Set initial category
  React.useEffect(() => {
    if (sortedCategories.length > 0 && activeCategoryId === null) {
      setActiveCategoryId(sortedCategories[0].id);
    }
  }, [sortedCategories, activeCategoryId]);

  const activeCategory = sortedCategories.find(c => c.id === activeCategoryId);
  const activeProducts = products.filter(p => p.categoryId === activeCategoryId && p.available);

  return (
    <div className="min-h-[100dvh] w-full bg-background flex flex-col select-none">
      {/* Header / Top Bar */}
      <header className="px-8 pt-12 pb-6 bg-card border-b border-card-border flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <button 
          onClick={() => setLocation('/')}
          className="h-16 px-6 rounded-xl border border-border text-foreground text-2xl font-medium flex items-center gap-4 active:bg-secondary transition-colors"
        >
          <ArrowLeft size={32} /> Retour
        </button>
        <h1 className="text-4xl font-serif text-primary tracking-wide">La Carte</h1>
        <div className="w-[140px]"></div> {/* Spacer for center alignment */}
      </header>

      {/* Category Tabs */}
      <div className="px-8 py-8 flex gap-6 overflow-x-auto no-scrollbar">
        {isLoadingCategories ? (
          <div className="flex gap-6 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 w-48 bg-muted rounded-2xl"></div>
            ))}
          </div>
        ) : (
          sortedCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryId(cat.id)}
              className={`h-24 px-10 rounded-2xl text-3xl font-semibold whitespace-nowrap transition-all duration-300 ${
                activeCategoryId === cat.id 
                  ? 'bg-primary text-primary-foreground shadow-[0_0_20px_rgba(245,158,11,0.3)]' 
                  : 'bg-secondary text-secondary-foreground border border-border opacity-70'
              }`}
            >
              {cat.name}
            </button>
          ))
        )}
      </div>

      {/* Product Grid */}
      <main className="flex-1 px-8 pb-48 overflow-y-auto">
        {isLoadingProducts ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-card h-[400px] rounded-3xl"></div>
            ))}
          </div>
        ) : (
          <motion.div 
            key={activeCategoryId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {activeProducts.map(product => {
              const imageSrc = product.imageUrl || getPlaceholderImage(activeCategory?.name || '');
              return (
                <div 
                  key={product.id}
                  className="bg-card border border-card-border rounded-3xl overflow-hidden flex flex-col shadow-lg"
                >
                  <div className="h-64 w-full relative bg-muted">
                    <img 
                      src={imageSrc} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-80" />
                  </div>
                  
                  <div className="p-8 flex-1 flex flex-col justify-between gap-6">
                    <div>
                      <h3 className="text-3xl font-serif text-foreground mb-3">{product.name}</h3>
                      {product.description && (
                        <p className="text-xl text-muted-foreground line-clamp-2">{product.description}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-3xl font-semibold text-primary">
                        {product.price.toFixed(2)} €
                      </span>
                      <button
                        onClick={() => addItem(product)}
                        className="h-16 w-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center active:scale-90 transition-transform shadow-md"
                      >
                        <Plus size={32} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {activeProducts.length === 0 && (
              <div className="col-span-full py-20 text-center text-muted-foreground text-3xl">
                Aucun produit disponible dans cette catégorie.
              </div>
            )}
          </motion.div>
        )}
      </main>

      {/* Floating Cart Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 z-20">
        <div className="bg-card border border-primary/30 rounded-[2rem] p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex items-center justify-between max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="h-20 w-20 bg-secondary rounded-full flex items-center justify-center text-primary">
                <ShoppingCart size={40} />
              </div>
              {totalItems > 0 && (
                <div className="absolute -top-2 -right-2 h-10 w-10 bg-primary text-primary-foreground text-xl font-bold rounded-full flex items-center justify-center shadow-lg">
                  {totalItems}
                </div>
              )}
            </div>
            <div>
              <p className="text-2xl text-muted-foreground">Total de la commande</p>
              <p className="text-4xl font-serif font-bold text-white">{totalPrice.toFixed(2)} €</p>
            </div>
          </div>
          
          <button
            onClick={() => setLocation('/cart')}
            disabled={totalItems === 0}
            className={`h-24 px-12 text-3xl font-bold rounded-2xl transition-all ${
              totalItems > 0
                ? 'bg-primary text-primary-foreground shadow-[0_0_20px_rgba(245,158,11,0.4)] active:scale-95'
                : 'bg-muted text-muted-foreground opacity-50 cursor-not-allowed'
            }`}
          >
            Voir le panier
          </button>
        </div>
      </div>
    </div>
  );
}
