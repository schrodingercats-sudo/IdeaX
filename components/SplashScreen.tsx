import React from 'react';

export const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center animate-fade-in">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://stale-red-jyjw1g1y9r.edgeone.app/detail_as11-44-6551_orig.jpg" 
          alt="Cosmic background" 
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      <div className="relative z-10 text-center">
        <h1 className="text-8xl md:text-9xl font-extrabold text-white tracking-tighter shadow-black/50 [text-shadow:0_5px_15px_var(--tw-shadow-color)]">
          IdeaX
        </h1>
        <p className="text-xl md:text-2xl font-medium text-white/80 tracking-wide mt-2 shadow-black/50 [text-shadow:0_2px_8px_var(--tw-shadow-color)]">
          beyond the search
        </p>
      </div>
    </div>
  );
};