import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { GiftEvent, TransactionType } from '../types';
import { ArrowUpCircle, ArrowDownCircle, ArrowRight } from 'lucide-react';

interface RedEnvelopeProps {
  event: GiftEvent;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  angle: number; // Position on circle in degrees (0-360)
  onViewDetails: (person: string) => void;
}

export const RedEnvelope: React.FC<RedEnvelopeProps> = ({ event, isHovered, onHover, angle, onViewDetails }) => {
  const isIncome = event.type === TransactionType.INCOME;
  const plateRef = useRef<HTMLDivElement>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number; side: 'left' | 'right' } | null>(null);
  
  // Radius calculations
  // Table size is 480px diameter -> 240px radius
  
  // Dish (w-20/80px): Center at 48.
  const dishRadius = 48; 
  
  // Plate (w-24/96px): Center at 132.
  const plateRadius = 132;

  // Split table into Left and Right halves based on vertical centerline (90deg - 270deg)
  // Left Half: 90 -> 270.
  const isLeftHalf = angle >= 90 && angle <= 270;

  // // FIXED ISSUE 2: Calculate position based on the actual DOM element's bounding box
  useEffect(() => {
    if (isHovered && plateRef.current) {
      const rect = plateRef.current.getBoundingClientRect();
      setTooltipPos({
        x: isLeftHalf ? rect.left : rect.right,
        y: rect.top + rect.height / 2,
        side: isLeftHalf ? 'left' : 'right'
      });
    }
  }, [isHovered, isLeftHalf]);

  // Deterministically select food type based on ID
  const getFoodContent = (id: string) => {
    const num = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const variant = num % 4;
  
    switch (variant) {
      case 0: // Dumplings / Buns
         return (
           <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute top-3 left-4 w-6 h-6 bg-[#fdfbf7] rounded-full border border-gray-200 shadow-sm"></div>
              <div className="absolute top-7 left-3 w-6 h-6 bg-[#fdfbf7] rounded-full border border-gray-200 shadow-sm"></div>
              <div className="absolute top-5 left-9 w-6 h-6 bg-[#fdfbf7] rounded-full border border-gray-200 shadow-sm"></div>
           </div>
         );
      case 1: // Spicy Fish/Meat (Red/Orange)
         return (
           <div className="w-full h-full bg-[#e85d04] rounded-full overflow-hidden border-2 border-white/50 relative">
              <div className="absolute top-3 left-4 w-5 h-5 bg-[#ffba08] rounded-full blur-[2px] opacity-80"></div>
              <div className="absolute bottom-3 right-5 w-8 h-3 bg-[#9d0208] rotate-12 rounded-full"></div>
              <div className="absolute top-3 right-4 w-2 h-2 bg-green-400 rounded-full"></div>
              <div className="absolute bottom-5 left-4 w-2 h-2 bg-green-400 rounded-full"></div>
           </div>
         );
      case 2: // Greens (Green)
         return (
            <div className="w-full h-full flex flex-wrap gap-1 justify-center items-center p-2">
               <div className="w-7 h-4 bg-[#38b000] rounded-full rotate-45 border border-green-800/10"></div>
               <div className="w-6 h-6 bg-[#70e000] rounded-full border border-green-800/10"></div>
               <div className="w-7 h-4 bg-[#008000] rounded-full -rotate-12 border border-green-800/10"></div>
            </div>
         );
      case 3: // Tofu / Scrambled Eggs (Yellow/White)
          return (
            <div className="w-full h-full bg-[#fff3b0] rounded-full overflow-hidden border border-yellow-200/50 relative">
               <div className="absolute top-4 left-3 w-6 h-6 bg-[#ffea00] rounded opacity-60"></div>
               <div className="absolute bottom-4 right-4 w-8 h-4 bg-white rounded-md shadow-sm"></div>
               <div className="absolute top-3 right-5 w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          )
      default:
         return null;
    }
  }

  return (
    <div 
      className={`absolute top-1/2 left-1/2 w-0 h-0 transition-all z-20`}
      style={{
        transform: `rotate(${angle}deg)`,
      }}
      onMouseEnter={() => onHover(event.id)}
      onMouseLeave={() => onHover(null)}
    >
        {/* The Shared Dish (Placed closer to center) 
            Size: w-20 h-20 (80px). Centered via -ml-10 -mt-10.
        */}
        <div 
            className="absolute top-1/2 left-1/2 transition-transform duration-300 origin-center pointer-events-none"
            style={{ 
                transform: `translate(${dishRadius}px, 0) rotate(90deg)`,
            }}
        >
            <div className="w-20 h-20 -ml-10 -mt-10 rounded-full bg-white shadow-md flex items-center justify-center border border-gray-100">
                {/* Food Content Container */}
                <div className="w-16 h-16">
                    {getFoodContent(event.id)}
                </div>
            </div>
        </div>

        {/* 
            Container for the Place Setting (User's Plate & Envelope).
            Size: w-24 h-24 (96px). Centered via -ml-12 -mt-12.
        */}
        <div 
            className="absolute top-1/2 left-1/2 transition-transform duration-300 origin-center"
            style={{ 
                transform: `translate(${plateRadius}px, 0) rotate(90deg) scale(${isHovered ? 1.1 : 1})`,
            }}
        >
            {/* Wrapper to center the 96x96 place setting on the radius point */}
            <div className="relative w-24 h-24 -ml-12 -mt-12" ref={plateRef}>
            
              {/* Plate (Center of this component) - w-24 h-24 */}
              <div className="relative w-24 h-24 rounded-full bg-[#f0f0f0] shadow-md flex items-center justify-center border border-gray-200 z-10">
                  {/* Inner rim */}
                  <div className="w-16 h-16 rounded-full border border-gray-300/50"></div>
                  
                  {/* Decoration: Rice grains / Crumbs */}
                  <div className="absolute top-6 left-6 w-1 h-1.5 bg-white rounded-full opacity-60 rotate-45"></div>
                  <div className="absolute bottom-5 right-7 w-1 h-1.5 bg-white rounded-full opacity-60 -rotate-12"></div>

                  {/* The Red Envelope (Placed on plate) */}
                  <div className="absolute w-11 h-16 bg-[#d11515] rounded shadow-[1px_2px_5px_rgba(0,0,0,0.3)] transform -rotate-6 border border-[#b91c1c] flex flex-col items-center pt-2 z-10 transition-transform hover:rotate-0">
                      {/* Gold Coin/Seal */}
                      <div className="w-3 h-3 rounded-full bg-[#FFD700] border border-yellow-200 shadow-sm"></div>
                      {/* Flap line */}
                      <div className="w-8 h-[1px] bg-black/20 mt-1"></div>
                  </div>
              </div>

              {/* Chopsticks (Right side) */}
              <div className="absolute top-0 right-[-14px] h-24 w-3 flex gap-0.5 justify-center rotate-6 opacity-90 z-20">
                  <div className="w-1 h-full bg-[#ddd] rounded-full shadow-[1px_1px_2px_rgba(0,0,0,0.1)]"></div>
                  <div className="w-1 h-full bg-[#ddd] rounded-full shadow-[1px_1px_2px_rgba(0,0,0,0.1)] mt-1.5"></div>
              </div>

              {/* Spoon/Bowl (Top Left) */}
              <div className="absolute -top-3 -left-4 z-20">
                  <div className="w-8 h-8 bg-white rounded-full shadow-md border border-gray-100 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-[#e6bf83] border-[1.5px] border-white opacity-80"></div>
                  </div>
                  {/* Spoon handle */}
                  <div className="absolute top-1.5 left-5 w-6 h-1.5 bg-white rounded-r-full rotate-[-45deg] shadow-sm"></div>
              </div>
            
            </div>
        </div>

        {/* 
          Floating Tooltip via Portal
          // FIXED ISSUE 1: Render via Portal to ensure top-layer z-index
        */}
        {isHovered && tooltipPos && createPortal(
          <div 
            className="fixed pointer-events-auto transition-all duration-300 ease-out z-[9999]"
            style={{ 
               top: tooltipPos.y,
               left: tooltipPos.x,
               // FIXED ISSUE 2: Dynamic anchor transform based on calculated side
               transform: `translate(${tooltipPos.side === 'left' ? '-100%' : '0'}, -50%) translateX(${tooltipPos.side === 'left' ? '-10px' : '10px'})`,
               width: '200px'
            }} 
            onMouseEnter={() => onHover(event.id)}
            onMouseLeave={() => onHover(null)}
          >
              <div className={`bg-white/50 backdrop-blur-md p-3 rounded-xl shadow-2xl relative cursor-default`}>
                <div className="flex justify-between items-center text-[10px] text-gray-800 uppercase font-bold tracking-widest mb-1">
                  <span>{event.date}</span>
                  {isIncome ? <ArrowDownCircle size={14} className="text-green-700"/> : <ArrowUpCircle size={14} className="text-red-700"/>}
                </div>
                
                <div className="flex justify-between items-start mb-1">
                   <div className="font-serif font-bold text-gray-900 text-base leading-tight">{event.person}</div>
                   <div className={`text-base font-bold ${isIncome ? 'text-green-800' : 'text-red-800'}`}>
                     ¥{event.amount.toLocaleString()}
                   </div>
                </div>
                
                <div className="text-xs text-gray-800 mb-2 font-medium bg-white/60 inline-block px-2 py-0.5 rounded-full">{event.occasion}</div>
                
                {event.aiAnalysis && (
                  <div className="mt-2 text-xs leading-relaxed text-gray-900 italic border-t border-gray-400/30 pt-2 font-serif font-medium">
                    "{event.aiAnalysis}"
                  </div>
                )}

                 <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetails(event.person);
                    }}
                    className="mt-3 w-full py-2 bg-[#8B0000] text-gold-coin text-[10px] font-bold uppercase tracking-widest rounded hover:bg-[#a52a2a] transition-colors flex items-center justify-center gap-1 border border-gold-coin/20 shadow-md group"
                  >
                    Read More <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
          </div>,
          document.body
        )}
    </div>
  );
};