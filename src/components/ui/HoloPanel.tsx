import { ReactNode } from 'react';

interface HoloPanelProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export const HoloPanel = ({ children, title, className = '' }: HoloPanelProps) => {
  return (
    <div className={`relative rounded-2xl bg-gradient-to-b from-[#0a1922] to-[#040b0f] border border-[#00f3ff]/40 shadow-[0_0_15px_rgba(0,243,255,0.2),inset_0_0_20px_rgba(0,243,255,0.1)] overflow-hidden ${className}`}>
      {/* Brilho superior (highlight) */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-[#00f3ff] shadow-[0_0_10px_#00f3ff,0_0_20px_#00f3ff]" />
      
      {/* Fundo com leve gradiente para dar textura */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#00f3ff]/5 to-transparent pointer-events-none" />

      {title && (
        <div className="px-4 py-3 border-b border-[#00f3ff]/20 bg-[#00f3ff]/5 flex justify-center">
          <h2 className="text-[#00f3ff] text-xs md:text-sm font-bold uppercase tracking-[0.2em] drop-shadow-[0_0_8px_rgba(0,243,255,0.8)]">
            {title}
          </h2>
        </div>
      )}
      
      <div className="p-4 relative z-10">
        {children}
      </div>
    </div>
  );
};
