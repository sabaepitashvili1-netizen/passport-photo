import React from 'react';
import { Stamp, ShieldCheck, Mail, Heart, Globe } from 'lucide-react';

interface FooterProps {
  onOpenCountryModal: () => void;
  onOpenGuaranteeModal: () => void;
  onOpenOrderModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenCountryModal,
  onOpenGuaranteeModal,
  onOpenOrderModal,
}) => {
  return (
    <footer className="mt-16 bg-[#261569] text-white border-t border-[#3C2F80]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-[#3C2F80]/60">
          
          {/* Brand info */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#5D3BE0] text-white flex items-center justify-center shadow-sm">
                <Stamp className="w-5 h-5 text-white" />
              </div>
              <span className="font-serif font-bold text-xl text-white">
                Earth Voyage
              </span>
            </div>
            <p className="text-xs text-[#E5DEFF] max-w-sm leading-relaxed">
              Translating digital traveler moments into physical keepsakes and certified biometric documentation. Guaranteed compliance with ICAO Doc 9303, US Department of State, and worldwide embassy passport rules.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#E5DEFF]/80 mt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Embassy Acceptance or Full Refund Guarantee</span>
            </div>
          </div>

          {/* Directory Links */}
          <div className="flex flex-col gap-2.5 text-xs text-[#E5DEFF]">
            <span className="font-serif font-bold text-sm text-white mb-1">
              Document Formats
            </span>
            <button
              onClick={onOpenCountryModal}
              className="text-left hover:text-white transition-colors"
            >
              US Passport (2×2 in / 51×51 mm)
            </button>
            <button
              onClick={onOpenCountryModal}
              className="text-left hover:text-white transition-colors"
            >
              Schengen Visa & EU Passport (35×45 mm)
            </button>
            <button
              onClick={onOpenCountryModal}
              className="text-left hover:text-white transition-colors"
            >
              Canada Passport & PR (50×70 mm)
            </button>
            <button
              onClick={onOpenCountryModal}
              className="text-left hover:text-white transition-colors"
            >
              United Kingdom HMPO (35×45 mm)
            </button>
            <button
              onClick={onOpenCountryModal}
              className="text-left hover:text-white transition-colors text-[#A89CF4] font-medium"
            >
              Browse All 50+ Countries →
            </button>
          </div>

          {/* Postal Services */}
          <div className="flex flex-col gap-2.5 text-xs text-[#E5DEFF]">
            <span className="font-serif font-bold text-sm text-white mb-1">
              Archival Keepsakes
            </span>
            <button
              onClick={onOpenOrderModal}
              className="text-left hover:text-white transition-colors"
            >
              Order Physical Prints via USPS
            </button>
            <button
              onClick={onOpenGuaranteeModal}
              className="text-left hover:text-white transition-colors"
            >
              Acceptance & Redo Guarantee
            </button>
            <span className="text-[#E5DEFF]/70 text-[11px] mt-1 leading-snug">
              Shipped in acid-free glassine protective sleeves with official verification seal.
            </span>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#E5DEFF]/70 gap-3">
          <div>
            © {new Date().getFullYear()} Earth Voyage Studio (earthvoyage.us). All rights reserved.
          </div>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Crafted for travelers worldwide</span>
            <span aria-hidden="true">·</span>
            <span>Local in-browser privacy guaranteed</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
