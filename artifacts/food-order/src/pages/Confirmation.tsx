import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Order } from '@workspace/api-client-react';
import { CheckCircle2, Receipt } from 'lucide-react';

export default function Confirmation() {
  const [_, setLocation] = useLocation();
  const [countdown, setCountdown] = useState(15);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    try {
      const savedOrder = localStorage.getItem('lastOrder');
      if (savedOrder) {
        setOrder(JSON.parse(savedOrder));
      }
    } catch (e) {
      console.error(e);
    }
    
    // Fallback timer if the user doesn't click
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setLocation('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [setLocation]);

  return (
    <div className="min-h-[100dvh] w-full bg-background flex items-center justify-center p-8 select-none">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-3xl w-full bg-card border border-card-border p-16 rounded-[3rem] shadow-2xl flex flex-col items-center text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-4 bg-primary" />
        
        <div className="h-32 w-32 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-10">
          <CheckCircle2 size={72} />
        </div>
        
        <h1 className="text-6xl font-serif text-white mb-6">Commande Confirmée !</h1>
        <p className="text-3xl text-muted-foreground mb-12">
          Veuillez récupérer votre ticket. Votre commande est en cours de préparation.
        </p>

        {order && (
          <div className="w-full bg-secondary border border-border p-8 rounded-3xl mb-12 flex items-center justify-center gap-6">
            <Receipt size={48} className="text-muted-foreground" />
            <div className="text-left">
              <p className="text-xl text-muted-foreground">Numéro de commande</p>
              <p className="text-5xl font-bold font-mono text-primary tracking-widest">
                #{order.id.toString().padStart(4, '0')}
              </p>
            </div>
          </div>
        )}

        <div className="w-full flex flex-col gap-6">
          <button 
            onClick={() => setLocation('/')}
            className="w-full h-28 bg-primary text-primary-foreground text-3xl font-bold rounded-2xl shadow-xl active:scale-[0.98] transition-transform"
          >
            Nouvelle commande
          </button>
          
          <p className="text-xl text-muted-foreground mt-4">
            Retour automatique à l'accueil dans <span className="text-white font-bold">{countdown}</span> secondes...
          </p>
        </div>
      </motion.div>
    </div>
  );
}
