import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import homeBgPath from '@assets/generated_images/home-bg.jpg';
import { useCart } from '@/context/CartContext';

export default function Home() {
  const [_, setLocation] = useLocation();
  const [showActionChoice, setShowActionChoice] = useState(false);
  const [showConfirmQuit, setShowConfirmQuit] = useState(false);
  const { clearCart } = useCart();

  const handleScreenTouch = () => {
    if (!showActionChoice && !showConfirmQuit) {
      setShowActionChoice(true);
    }
  };

  const handleCommander = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocation('/menu');
  };

  const handleAbandonner = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirmQuit(true);
    setShowActionChoice(false);
  };

  const handleQuit = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearCart();
    setShowConfirmQuit(false);
    setShowActionChoice(false);
  };

  const handleContinue = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirmQuit(false);
    setShowActionChoice(true);
  };

  return (
    <div 
      className="relative w-full h-[100dvh] overflow-hidden bg-black cursor-pointer select-none"
      onClick={handleScreenTouch}
    >
      {/* Background Image/Video */}
      <div className="absolute inset-0">
        <img 
          src={homeBgPath} 
          alt="Gourmet Food Background" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>

      {/* Default Idle State */}
      <AnimatePresence>
        {!showActionChoice && !showConfirmQuit && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          >
            <motion.h1 
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="text-6xl font-serif text-white tracking-wider text-center drop-shadow-lg"
            >
              L'Étoile
            </motion.h1>
            <motion.p 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mt-16 text-3xl font-light text-primary tracking-widest uppercase drop-shadow-md"
            >
              Touchez l'écran pour commencer
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Choice Overlay */}
      <AnimatePresence>
        {showActionChoice && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="absolute inset-0 flex items-center justify-center bg-black/60 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-8 w-full max-w-2xl px-8">
              <h2 className="text-5xl font-serif text-white text-center mb-8">Que souhaitez-vous faire ?</h2>
              <button 
                onClick={handleCommander}
                className="w-full h-32 bg-primary text-primary-foreground text-4xl font-semibold rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-4"
              >
                Commander
              </button>
              <button 
                onClick={handleAbandonner}
                className="w-full h-32 bg-secondary text-secondary-foreground border-2 border-border text-4xl font-semibold rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-4"
              >
                Abandonner
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Quit Overlay */}
      <AnimatePresence>
        {showConfirmQuit && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-card border border-card-border p-12 rounded-3xl w-full max-w-3xl flex flex-col gap-12 shadow-2xl">
              <h2 className="text-5xl font-serif text-center text-white">Voulez-vous vraiment annuler ?</h2>
              <p className="text-2xl text-muted-foreground text-center">Votre session sera réinitialisée.</p>
              
              <div className="flex gap-6 mt-4">
                <button 
                  onClick={handleQuit}
                  className="flex-1 h-28 bg-destructive text-destructive-foreground text-3xl font-semibold rounded-2xl shadow-lg active:scale-[0.98] transition-transform"
                >
                  Oui, quitter
                </button>
                <button 
                  onClick={handleContinue}
                  className="flex-1 h-28 bg-secondary text-secondary-foreground border border-border text-3xl font-semibold rounded-2xl shadow-lg active:scale-[0.98] transition-transform"
                >
                  Non, continuer
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
