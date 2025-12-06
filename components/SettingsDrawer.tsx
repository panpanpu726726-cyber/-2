
import React, { useState } from 'react';
import { X, Bell, Settings, Star, Coins, ChevronRight, ToggleLeft, ToggleRight } from 'lucide-react';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({ isOpen, onClose }) => {
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [rating, setRating] = useState(0);

  // Helper Card Component for Settings Items
  const SettingCard = ({ icon, label, children, onClick }: any) => (
    <div 
        onClick={onClick}
        className="bg-black/10 hover:bg-black/20 transition-colors border-b border-white/5 p-4 flex items-center justify-between group cursor-pointer"
    >
        <div className="flex items-center gap-3 text-white/90">
            <span className="text-gold-coin opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                {icon}
            </span>
            <span className="font-serif font-bold text-sm tracking-wide group-hover:text-white transition-colors">
                {label}
            </span>
        </div>
        <div>
            {children}
        </div>
    </div>
  );

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Drawer Container */}
      <div className={`fixed top-0 left-0 h-full w-[350px] bg-[#cf1515] z-[70] shadow-[10px_0_40px_rgba(0,0,0,0.6)] transform transition-transform duration-500 cubic-bezier(0.25, 1, 0.5, 1) flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* --- Envelope Flap Header --- */}
        <div className="relative w-full h-[240px] shrink-0 z-20">
            {/* Flap Background */}
            <div className="absolute inset-0 bg-[#ff5e57]"></div>
            
            {/* The Curve (Envelope Triangle) */}
            <div className="absolute bottom-[-40px] left-0 w-full h-[80px] bg-[#ff5e57] rounded-b-[100%] shadow-md z-10"></div>
            
            {/* Close Button */}
            <button 
                onClick={onClose} 
                className="absolute top-6 right-6 text-white/60 hover:text-white hover:rotate-90 transition-all z-50"
            >
                <X size={26} />
            </button>

            {/* Header Content */}
            <div className="relative z-50 p-8 pt-12 text-center">
                <div className="w-16 h-16 bg-white/10 rounded-full mx-auto mb-4 flex items-center justify-center border border-white/20 shadow-inner backdrop-blur-md">
                    <Settings className="text-white animate-spin-slow" size={32} />
                </div>
                <h2 className="text-2xl font-serif font-bold text-white tracking-widest drop-shadow-md">SETTINGS</h2>
                <p className="text-white/60 text-xs font-serif mt-1 italic">Manage your Renqing preferences</p>
            </div>
        </div>

        {/* The Seal */}
        <div className="absolute top-[210px] left-1/2 -translate-x-1/2 w-20 h-20 bg-[#b01010] rounded-full shadow-[0_6px_15px_rgba(0,0,0,0.3)] z-30 flex items-center justify-center border border-[#d11515]">
           <div className="w-16 h-16 rounded-full bg-[#c21414] opacity-40 flex items-center justify-center">
               <span className="text-[10px] font-bold text-black/20 uppercase tracking-widest">Setup</span>
           </div>
        </div>

        {/* --- Settings List --- */}
        <div className="flex-1 overflow-y-auto pt-16 pb-8 px-4 z-10 custom-scrollbar space-y-1">
            
            {/* Daily Reminder */}
            <div className="rounded-t-xl overflow-hidden">
                <SettingCard 
                    icon={<Bell size={18} />} 
                    label="Daily Reminder"
                    onClick={() => setReminderEnabled(!reminderEnabled)}
                >
                    <button className="text-gold-coin transition-all hover:scale-110">
                        {reminderEnabled ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-white/30" />}
                    </button>
                </SettingCard>
            </div>

            {/* Preferences */}
            <SettingCard 
                icon={<Settings size={18} />} 
                label="Preferences"
            >
                <ChevronRight size={18} className="text-white/40" />
            </SettingCard>

            {/* Default Currency */}
            <SettingCard 
                icon={<Coins size={18} />} 
                label="Default Currency"
            >
                <span className="font-mono text-xs font-bold bg-black/20 text-white/80 px-2 py-1 rounded border border-white/10">
                    CNY (¥)
                </span>
            </SettingCard>

            {/* Rating */}
            <div className="rounded-b-xl overflow-hidden">
                 <div className="bg-black/10 border-b border-white/5 p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-3 text-white/90">
                        <span className="text-gold-coin opacity-80"><Star size={18} /></span>
                        <span className="font-serif font-bold text-sm tracking-wide">Rate App</span>
                    </div>
                    <div className="flex justify-center gap-2 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button 
                                key={star}
                                onClick={() => setRating(star)}
                                className="hover:scale-125 transition-transform"
                            >
                                <Star 
                                    size={20} 
                                    className={`${star <= rating ? 'fill-gold-coin text-gold-coin' : 'text-white/20'}`} 
                                />
                            </button>
                        ))}
                    </div>
                 </div>
            </div>

            {/* Footer Info */}
            <div className="mt-8 text-center opacity-40">
                <p className="text-[10px] text-white font-mono uppercase tracking-widest">Version 1.0.0</p>
                <p className="text-[10px] text-white font-serif mt-1">Fenzi Qian &copy; 2024</p>
            </div>
            
        </div>
        
        {/* Bottom Shadow Gradient */}
        <div className="absolute bottom-0 w-full h-12 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>

      </div>
    </>
  );
};
