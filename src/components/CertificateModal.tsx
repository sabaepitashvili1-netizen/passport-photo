import React from 'react';
import { X, Award, ShieldCheck, Printer, CheckCircle2 } from 'lucide-react';
import { CountrySpec } from '../types/passport';
import { ComplianceSummary } from '../utils/complianceChecker';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  spec: CountrySpec;
  compliance: ComplianceSummary;
  imageSrc: string;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  spec,
  compliance,
  imageSrc,
}) => {
  if (!isOpen) return null;

  const certificateId = `EV-CERT-${Date.now().toString().slice(-8)}`;
  const dateStr = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#261569]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#3C2F80]/15 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#3C2F80]/10 flex items-center justify-between bg-[#FAF8FF]">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#5D3BE0]" />
            <h3 className="font-serif font-bold text-lg text-[#261569]">
              Biometric Compliance Certificate
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#5C5577] hover:text-[#261569] hover:bg-[#F2F0F7] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Body (Parchment / Archival Style) */}
        <div className="p-8 bg-[#FAF8FF] m-4 rounded-xl border-2 border-double border-[#5D3BE0]/30 relative flex flex-col items-center text-center">
          
          {/* Subtle Postmark seal watermark */}
          <div className="absolute top-6 right-6 w-16 h-16 rounded-full border-2 border-dashed border-[#5D3BE0]/30 flex flex-col items-center justify-center -rotate-12 pointer-events-none select-none">
            <span className="text-[7px] font-bold text-[#5D3BE0]">ICAO 9303</span>
            <span className="text-[8px] font-bold text-[#261569]">VERIFIED</span>
          </div>

          <div className="w-12 h-12 rounded-full bg-[#261569] text-white flex items-center justify-center shadow-xs mb-3">
            <ShieldCheck className="w-7 h-7 text-[#E5DEFF]" />
          </div>

          <span className="text-[10px] font-bold tracking-widest uppercase text-[#5D3BE0] font-sans">
            Official Biometric Validation Document
          </span>

          <h2 className="font-serif font-bold text-2xl text-[#261569] mt-1 mb-2">
            Certificate of Compliance
          </h2>

          <p className="text-xs text-[#5C5577] max-w-sm mb-6">
            This certifies that the biometric portrait captured below adheres strictly to the official parameters defined by {spec.officialStandard}.
          </p>

          {/* Photo and data specs preview */}
          <div className="flex items-center gap-5 p-3 rounded-lg bg-white border border-[#3C2F80]/15 w-full max-w-sm mb-6 text-left">
            <img
              src={imageSrc}
              alt="Subject"
              className="w-16 h-16 object-cover rounded border border-slate-200"
            />
            <div className="text-xs flex flex-col gap-0.5">
              <span className="font-bold text-[#261569]">{spec.countryName} ({spec.documentType})</span>
              <span className="text-[#5C5577]">Dimensions: {spec.widthMm}×{spec.heightMm}mm ({spec.widthInches}×{spec.heightInches}")</span>
              <span className="text-[#5C5577]">Resolution: 300 DPI Standard</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px]">
                <CheckCircle2 className="w-3 h-3" /> Biometric Score: {compliance.score}%
              </span>
            </div>
          </div>

          <div className="w-full flex justify-between items-center text-[11px] text-[#797582] border-t border-[#3C2F80]/10 pt-4">
            <div>
              <span className="block font-semibold text-[#261569]">Certificate ID:</span>
              <span className="font-mono">{certificateId}</span>
            </div>
            <div>
              <span className="block font-semibold text-[#261569]">Issued Date:</span>
              <span>{dateStr}</span>
            </div>
            <div>
              <span className="block font-semibold text-[#261569]">Authority:</span>
              <span>Earth Voyage Studio</span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-[#3C2F80]/10 flex items-center justify-between">
          <span className="text-xs text-[#797582]">
            Accepted by all embassies, consulates & passport offices worldwide.
          </span>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#261569] text-white text-xs font-semibold hover:bg-[#1A0E47] transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Certificate</span>
          </button>
        </div>

      </div>
    </div>
  );
};
