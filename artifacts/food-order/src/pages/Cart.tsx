import React from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useCreateOrder } from '@workspace/api-client-react';
import { ArrowLeft, Trash2, Plus, Minus, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Cart() {
  const [_, setLocation] = useLocation();
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCart();
  const createOrder = useCreateOrder();
  const { toast } = useToast();

  const handleCheckout = () => {
    if (items.length === 0) return;

    createOrder.mutate({
      data: {
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        }))
      }
    }, {
      onSuccess: (order) => {
        clearCart();
        // Pass the order details via state or encode in URL (wouter doesn't support state out of the box so well, we'll store it in localStorage briefly or just rely on a success page)
        localStorage.setItem('lastOrder', JSON.stringify(order));
        setLocation('/confirmation');
      },
      onError: () => {
        toast({
          title: "Erreur de paiement",
          description: "Impossible de procéder au paiement. Veuillez réessayer.",
          variant: "destructive"
        });
      }
    });
  };

  return (
    <div className="min-h-[100dvh] w-full bg-background flex flex-col select-none">
      <header className="px-8 pt-12 pb-6 bg-card border-b border-card-border flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <button 
          onClick={() => setLocation('/menu')}
          className="h-16 px-6 rounded-xl border border-border text-foreground text-2xl font-medium flex items-center gap-4 active:bg-secondary transition-colors"
        >
          <ArrowLeft size={32} /> Menu
        </button>
        <h1 className="text-4xl font-serif text-primary tracking-wide">Votre Panier</h1>
        <div className="w-[140px]"></div>
      </header>

      <main className="flex-1 px-8 py-12 overflow-y-auto max-w-5xl mx-auto w-full">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] gap-8">
            <div className="h-40 w-40 bg-secondary rounded-full flex items-center justify-center text-muted-foreground mb-8">
              <Trash2 size={64} />
            </div>
            <h2 className="text-4xl font-serif text-foreground">Votre panier est vide</h2>
            <p className="text-2xl text-muted-foreground text-center">Ajoutez des plats succulents à votre commande pour commencer.</p>
            <button 
              onClick={() => setLocation('/menu')}
              className="mt-8 h-20 px-12 bg-primary text-primary-foreground text-2xl font-semibold rounded-2xl shadow-lg active:scale-95 transition-transform"
            >
              Découvrir le Menu
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div 
                  key={item.product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
                  className="bg-card border border-card-border rounded-3xl p-8 flex items-center gap-8 shadow-sm"
                >
                  <div className="flex-1">
                    <h3 className="text-3xl font-serif text-foreground mb-2">{item.product.name}</h3>
                    <p className="text-2xl text-primary font-semibold">{item.product.price.toFixed(2)} €</p>
                  </div>
                  
                  <div className="flex items-center gap-6 bg-secondary p-2 rounded-2xl border border-border">
                    <button 
                      onClick={() => item.quantity > 1 ? updateQuantity(item.product.id, -1) : removeItem(item.product.id)}
                      className="h-16 w-16 flex items-center justify-center rounded-xl bg-background text-foreground active:scale-95 transition-transform shadow-sm"
                    >
                      {item.quantity === 1 ? <Trash2 size={28} className="text-destructive" /> : <Minus size={28} />}
                    </button>
                    <span className="text-3xl font-bold w-12 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.product.id, 1)}
                      className="h-16 w-16 flex items-center justify-center rounded-xl bg-background text-foreground active:scale-95 transition-transform shadow-sm"
                    >
                      <Plus size={28} />
                    </button>
                  </div>
                  
                  <div className="w-48 text-right">
                    <p className="text-xl text-muted-foreground mb-1">Sous-total</p>
                    <p className="text-3xl font-bold text-white">{(item.product.price * item.quantity).toFixed(2)} €</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {items.length > 0 && (
        <div className="bg-card border-t border-card-border p-8 sticky bottom-0 z-20 shadow-[0_-20px_40px_rgba(0,0,0,0.4)]">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-2xl text-muted-foreground mb-2">Total à payer</p>
              <p className="text-5xl font-serif font-bold text-primary">{totalPrice.toFixed(2)} €</p>
            </div>
            
            <div className="flex gap-6">
              <button 
                onClick={() => setLocation('/menu')}
                className="h-24 px-10 bg-secondary text-secondary-foreground border border-border text-2xl font-bold rounded-2xl active:scale-95 transition-transform"
              >
                Ajouter des articles
              </button>
              <button 
                onClick={handleCheckout}
                disabled={createOrder.isPending}
                className="h-24 px-12 bg-primary text-primary-foreground text-3xl font-bold rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.3)] active:scale-95 transition-transform flex items-center gap-4"
              >
                {createOrder.isPending ? (
                  <><Loader2 className="animate-spin" size={36} /> Traitement...</>
                ) : (
                  "Procéder au paiement"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
