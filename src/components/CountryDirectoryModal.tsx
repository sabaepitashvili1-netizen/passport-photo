import React, { useState, useMemo } from 'react';
import { X, Search, Globe, Check, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { CountrySpec } from '../types/passport';
import { COUNTRY_SPECS } from '../data/countries';

interface CountryDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSpec: CountrySpec;
  onSelectSpec: (spec: CountrySpec) => void;
}

export const CountryDirectoryModal: React.FC<CountryDirectoryModalProps> = ({
  isOpen,
  onClose,
  activeSpec,
  onSelectSpec,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');

  const regions = ['All', 'Americas', 'Europe', 'Asia-Pacific', 'Middle East & Africa'];

  const filteredSpecs = useMemo(() => {
    return COUNTRY_SPECS.filter((spec) => {
      const matchesSearch =
        spec.countryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        spec.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        spec.countryCode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRegion = selectedRegion === 'All' || spec.region === selectedRegion;
      return matchesSearch && matchesRegion;
    });
  }, [searchTerm, selectedRegion]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#261569]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#3C2F80]/15 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#3C2F80]/10 flex items-center justify-between bg-[#FAF8FF]">
          <div>
            <h3 className="font-serif font-bold text-xl text-[#261569]">
              Worldwide Passport & Visa Requirements
            </h3>
            <p className="text-xs text-[#5C5577] font-sans mt-0.5">
              Select your destination country to automatically configure millimetric bounds, background colors, and biometric rules.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#5C5577] hover:text-[#261569] hover:bg-[#F2F0F7] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Region Filters */}
        <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#797582] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search country, visa type or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-white border border-[#3C2F80]/20 text-xs sm:text-sm text-[#261569] placeholder:text-[#797582] focus:outline-none focus:ring-2 focus:ring-[#5D3BE0]/20 focus:border-[#5D3BE0]"
            />
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto p-1 bg-white rounded-lg border border-slate-200">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedRegion === region
                    ? 'bg-[#261569] text-white shadow-2xs'
                    : 'text-[#5C5577] hover:text-[#261569] hover:bg-slate-50'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {/* Directory Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSpecs.map((spec) => {
            const isSelected = activeSpec.id === spec.id;
            return (
              <div
                key={spec.id}
                onClick={() => {
                  onSelectSpec(spec);
                  onClose();
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#FAF8FF] border-[#5D3BE0] ring-2 ring-[#5D3BE0]/20 shadow-sm'
                    : 'bg-white border-[#3C2F80]/10 hover:border-[#5D3BE0]/50 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-md bg-[#261569] text-white text-xs font-bold flex items-center justify-center font-sans">
                        {spec.countryCode}
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-base text-[#261569] leading-tight">
                          {spec.countryName}
                        </h4>
                        <span className="text-xs text-[#5C5577]">{spec.documentType}</span>
                      </div>
                    </div>
                    {isSelected ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-[#5D3BE0] bg-[#E5DEFF] px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" /> Active
                      </span>
                    ) : spec.popular ? (
                      <span className="text-[10px] uppercase font-bold text-[#261569] bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                        Popular
                      </span>
                    ) : null}
                  </div>

                  {/* Specifications Pill / Details */}
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs text-[#484551]">
                    <div>
                      <span className="text-[#797582] text-[11px] block">Dimensions:</span>
                      <span className="font-semibold text-[#261569]">
                        {spec.widthMm} × {spec.heightMm} mm ({spec.widthInches} × {spec.heightInches}")
                      </span>
                    </div>
                    <div>
                      <span className="text-[#797582] text-[11px] block">Head Coverage:</span>
                      <span className="font-semibold text-[#261569]">
                        {spec.headSizePercentMin}% – {spec.headSizePercentMax}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[#797582] text-[11px] block">Background:</span>
                      <span className="font-medium">{spec.bgRequirement}</span>
                    </div>
                    <div>
                      <span className="text-[#797582] text-[11px] block">On 4×6 Sheet:</span>
                      <span className="font-semibold text-[#5D3BE0]">{spec.sheetCount} Photos</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#797582] truncate max-w-[200px]">
                    {spec.officialStandard}
                  </span>
                  <span className="font-semibold text-[#5D3BE0] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    {isSelected ? 'Currently Selected' : 'Apply Specification'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#FAF8FF] border-t border-[#3C2F80]/10 flex items-center justify-between text-xs text-[#5C5577]">
          <span>Showing {filteredSpecs.length} government passport & visa standards</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white border border-[#3C2F80]/20 text-[#261569] font-medium hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
