import React from 'react';
import { X, ShieldCheck, CheckCircle2, RotateCcw, Clock, Lock } from 'lucide-react';

interface GuaranteedAcceptanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuaranteedAcceptanceModal: React.FC<GuaranteedAcceptanceModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#261569]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#3C2F80]/15 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#3C2F80]/10 flex items-center justify-between bg-[#FAF8FF]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#261569]">
                100% Acceptance Guarantee
              </h3>
              <p className="text-xs text-[#5C5577]">
                Official Earth Voyage Quality & Compliance Pledge
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#5C5577] hover:text-[#261569] hover:bg-[#F2F0F7] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-4 text-xs text-[#484551] leading-relaxed">
          <p className="text-sm font-serif font-medium text-[#261569]">
            We guarantee that passport and visa photos generated through Earth Voyage will be 100% accepted by your government passport agency or embassy.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-[#FAF8FF] border border-[#3C2F80]/10 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 font-bold text-[#261569]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>ICAO Doc 9303 Standards</span>
              </div>
              <p className="text-[#5C5577]">
                Photos adhere strictly to international biometric standards: facial ratio, eye level, neutral gaze, and uniform background color.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF8FF] border border-[#3C2F80]/10 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 font-bold text-[#261569]">
                <RotateCcw className="w-4 h-4 text-[#5D3BE0]" />
                <span>Full Refund + Free Redo</span>
              </div>
              <p className="text-[#5C5577]">
                In the rare event of government rejection, send us the rejection notice for an immediate 100% full refund plus free expedited reprints.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF8FF] border border-[#3C2F80]/10 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 font-bold text-[#261569]">
                <Lock className="w-4 h-4 text-[#5D3BE0]" />
                <span>Local Privacy Guarantee</span>
              </div>
              <p className="text-[#5C5577]">
                All photo cropping and adjustments happen locally in your browser session. Your portrait is never sold, shared, or leaked to third parties.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF8FF] border border-[#3C2F80]/10 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 font-bold text-[#261569]">
                <Clock className="w-4 h-4 text-[#5D3BE0]" />
                <span>Continuous Specification Updates</span>
              </div>
              <p className="text-[#5C5577]">
                Our directory monitors monthly regulation changes for 50+ countries to ensure up-to-the-minute embassy compliance.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#FAF8FF] border-t border-[#3C2F80]/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#261569] text-white text-xs font-semibold hover:bg-[#1A0E47] transition-colors"
          >
            I Understand
          </button>
        </div>

      </div>
    </div>
  );
};
