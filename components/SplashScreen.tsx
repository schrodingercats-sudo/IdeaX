
import React from 'react';

export const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center animate-fade-in">
      <div className="absolute inset-0">
        <img 
          src="components/IdeaX.png" 
          alt="Earth rising over the moon"
          className="h-full w-full object-cover opacity-80"
        />
      </div>
      <div className="relative z-10 text-center">
        <h1 className="text-8xl md:text-9xl font-extrabold text-white tracking-tighter shadow-black/50 [text-shadow:0_5px_15px_var(--tw-shadow-color)]">
          IdeaX
        </h1>
      </div>
    </div>
  );
};