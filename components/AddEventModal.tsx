import React, { useState } from 'react';
import { X, Loader2, Sparkles, BookOpenText } from 'lucide-react';
import { TransactionType, GiftEvent } from '../types';
import { analyzeTransaction } from '../services/geminiService';
import { CATEGORIES, OCCASIONS } from '../utils';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (event: GiftEvent) => void;
  onSwitchToDetail: (partialData: Partial<GiftEvent>) => void;
}

export const AddEventModal: React.FC<AddEventModalProps> = ({ isOpen, onClose, onAdd, onSwitchToDetail }) => {
  const [person, setPerson] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [occasion, setOccasion] = useState('');
  const [relationType, setRelationType] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!person || !amount || !occasion) return;

    setIsAnalyzing(true);
    
    // Call Gemini to analyze the "deep meaning"
    const analysis = await analyzeTransaction(person, parseFloat(amount), type, occasion);

    const newEvent: GiftEvent = {
      id: Date.now().toString(),
      person,
      amount: parseFloat(amount),
      date,
      type,
      occasion,
      aiAnalysis: analysis,
      description: relationType 
    };

    onAdd(newEvent);
    setIsAnalyzing(false);
    resetForm();
    onClose();
  };

  const handleAddDetails = () => {
    onSwitchToDetail({
        person,
        amount: amount ? parseFloat(amount) : 0,
        occasion,
        date,
        type,
        description: relationType
    });
  };

  const resetForm = () => {
    setPerson('');
    setAmount('');
    setOccasion('');
    setRelationType('');
    setType(TransactionType.EXPENSE);
  };

  // Helper Input Component matching the Red Theme
  const RedThemeInput = ({ label, value, onChange, placeholder, type = "text", isSelect = false, options = [] }: any) => (
    <fieldset className="border-[2px] border-white/60 rounded-lg px-3 pb-2 pt-1 bg-black/10 hover:bg-black/20 transition-colors group w-full relative">
       <legend className="text-[10px] text-white/80 px-2 font-bold tracking-wider ml-1 uppercase">
          {label}
       </legend>
       <div className="-mt-1">
           {isSelect ? (
                <select 
                    value={value} 
                    onChange={onChange}
                    className="w-full bg-transparent text-white font-serif font-bold text-base border-none outline-none appearance-none cursor-pointer py-1"
                >
                    <option value="" className="bg-[#8B0000] text-gray-300">Select...</option>
                    {options.map((opt: string) => (
                        <option key={opt} value={opt} className="bg-[#8B0000] text-white">{opt}</option>
                    ))}
                </select>
           ) : (
               <input 
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full bg-transparent text-white font-serif font-bold text-base leading-tight border-none outline-none placeholder-white/30 py-1"
               />
           )}
       </div>
    </fieldset>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      {/* Container - Red Envelope Style */}
      <div className="relative w-full max-w-md bg-[#cf1515] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* --- Header (The Flap) --- */}
        <div className="relative h-28 shrink-0 z-20">
             {/* Main Flap Color */}
             <div className="absolute inset-0 bg-[#ff5e57]"></div>
             
             {/* The Curve */}
             <div className="absolute bottom-[-30px] left-0 w-full h-[60px] bg-[#ff5e57] rounded-b-[100%] shadow-md z-10"></div>
             
             {/* The Seal */}
             <div className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 w-16 h-16 bg-[#b01010] rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.3)] z-30 flex items-center justify-center border border-[#d11515]">
                <div className="w-12 h-12 rounded-full bg-[#c21414] opacity-30"></div>
             </div>

             {/* Header Content */}
             <div className="relative z-50 flex justify-between items-start p-5">
                <div>
                    <h2 className="text-gold-coin font-serif font-bold text-xl tracking-widest drop-shadow-sm">
                        QUICK ADD
                    </h2>
                    <p className="text-red-100 text-xs opacity-80 font-serif italic">Record a transaction</p>
                </div>
                <button onClick={onClose} className="text-white/70 hover:text-white hover:rotate-90 transition-all">
                    <X size={26} />
                </button>
             </div>
        </div>

        {/* --- Body --- */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pt-12 z-10 space-y-5">
            <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Type Toggle */}
                <div className="flex gap-3">
                    <button
                    type="button"
                    onClick={() => setType(TransactionType.EXPENSE)}
                    className={`flex-1 py-3 rounded-lg border-2 transition-all font-serif font-bold uppercase text-xs tracking-wider ${
                        type === TransactionType.EXPENSE 
                        ? 'bg-[#991b1b] border-[#ef4444] text-white shadow-md' 
                        : 'bg-black/10 border-white/10 text-white/50 hover:bg-black/20'
                    }`}
                    >
                    Giving
                    </button>
                    <button
                    type="button"
                    onClick={() => setType(TransactionType.INCOME)}
                    className={`flex-1 py-3 rounded-lg border-2 transition-all font-serif font-bold uppercase text-xs tracking-wider ${
                        type === TransactionType.INCOME 
                        ? 'bg-[#b45309] border-[#FFD700] text-[#FFD700] shadow-md' 
                        : 'bg-black/10 border-white/10 text-white/50 hover:bg-black/20'
                    }`}
                    >
                    Receiving
                    </button>
                </div>

                <RedThemeInput 
                    label="Date"
                    type="date" 
                    value={date}
                    onChange={(e: any) => setDate(e.target.value)}
                />

                <RedThemeInput 
                    label="Target Person"
                    placeholder="e.g. Uncle Zhang"
                    value={person}
                    onChange={(e: any) => setPerson(e.target.value)}
                />

                <div className="space-y-5">
                    <RedThemeInput 
                        label="Occasion Type"
                        isSelect
                        value={occasion}
                        onChange={(e: any) => setOccasion(e.target.value)}
                        options={OCCASIONS}
                    />

                    <RedThemeInput 
                        label="Relation Type"
                        isSelect
                        value={relationType}
                        onChange={(e: any) => setRelationType(e.target.value)}
                        options={CATEGORIES}
                    />
                </div>

                <RedThemeInput 
                    label="Amount (¥)"
                    type="number"
                    placeholder="888"
                    value={amount}
                    onChange={(e: any) => setAmount(e.target.value)}
                />

                {/* Footer Buttons */}
                <div className="pt-4 flex gap-3">
                    <button
                        type="button"
                        onClick={handleAddDetails}
                        className="flex-1 bg-transparent text-white border border-white/30 py-3 rounded-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2 font-serif text-xs font-bold uppercase tracking-wide"
                    >
                        <BookOpenText size={16} /> Add Details
                    </button>

                    <button
                        type="submit"
                        disabled={isAnalyzing}
                        className="flex-[2] bg-gold-coin text-[#8B0000] py-3 rounded-lg shadow-lg hover:bg-yellow-400 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 font-serif text-sm font-bold uppercase tracking-wide disabled:opacity-70 disabled:cursor-not-allowed border border-yellow-300/50"
                    >
                        {isAnalyzing ? (
                            <>
                            <Loader2 className="animate-spin" size={16} /> Processing...
                            </>
                        ) : (
                            <>
                            <Sparkles size={16} /> Quick Add
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>

      </div>
    </div>
  );
};