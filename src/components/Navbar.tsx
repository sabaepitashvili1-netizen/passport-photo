import React from 'react';
import { Globe, Stamp, ShieldCheck, Mail, BookOpen, Layers } from 'lucide-react';
import { CountrySpec } from '../types/passport';

interface NavbarProps {
  currentSpec: CountrySpec;
  onOpenCountryModal: () => void;
  onOpenSpecsModal: () => void;
  onOpenGuaranteeModal: () => void;
  onOpenOrderModal: () => void;
  onOpenSavedOrders: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSpec,
  onOpenCountryModal,
  onOpenSpecsModal,
  onOpenGuaranteeModal,
  onOpenOrderModal,
  onOpenSavedOrders,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF8FF]/90 backdrop-blur-md border-b border-[#3C2F80]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand identity */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            {/* Stamp-like emblem */}
            <div className="w-11 h-11 rounded-lg bg-[#261569] text-white flex items-center justify-center shadow-md shadow-[#261569]/15 border border-[#5D3BE0]/30 transition-transform group-hover:scale-105">
              <Stamp className="w-6 h-6 text-[#E5DEFF]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-xl tracking-tight text-[#261569]">
                  Earth Voyage
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded bg-[#E5DEFF] text-[#261569] font-sans">
                  Hub
                </span>
              </div>
              <p className="text-xs text-[#5C5577] font-sans tracking-wide">
                Passport & Visa Photo Studio
              </p>
            </div>
          </div>

          {/* Quick Active Country Button */}
          <div className="hidden md:flex items-center ml-4 pl-4 border-l border-[#3C2F80]/15">
            <button
              onClick={onOpenCountryModal}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white border border-[#3C2F80]/15 hover:border-[#5D3BE0] text-xs font-medium text-[#261569] shadow-xs transition-all hover:shadow-sm"
              title="Change country document format"
            >
              <Globe className="w-3.5 h-3.5 text-[#5D3BE0]" />
              <span className="font-semibold">{currentSpec.countryName}</span>
              <span className="text-[#5C5577]">({currentSpec.widthInches}x{currentSpec.heightInches}" / {currentSpec.widthMm}x{currentSpec.heightMm}mm)</span>
              <span className="text-[10px] text-[#5D3BE0] font-bold underline ml-1">Change</span>
            </button>
          </div>
        </div>

        {/* Central Navigation */}
        <nav className="hidden lg:flex items-center gap-6 text-sm text-[#484551] font-sans">
          <button
            onClick={onOpenSpecsModal}
            className="flex items-center gap-1.5 hover:text-[#261569] transition-colors font-medium py-1"
          >
            <BookOpen className="w-4 h-4 text-[#5D3BE0]" />
            Document Directory
          </button>
          <button
            onClick={onOpenGuaranteeModal}
            className="flex items-center gap-1.5 hover:text-[#261569] transition-colors font-medium py-1"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            100% Acceptance Guarantee
          </button>
          <button
            onClick={onOpenSavedOrders}
            className="flex items-center gap-1.5 hover:text-[#261569] transition-colors font-medium py-1"
          >
            <Layers className="w-4 h-4 text-[#5D3BE0]" />
            Recent Keepsakes
          </button>
        </nav>

        {/* Primary Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenOrderModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#5D3BE0] hover:bg-[#4E2EC7] text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
          >
            <Mail className="w-4 h-4" />
            <span>Order Physical Prints</span>
          </button>
        </div>

      </div>
    </header>
  );
};
