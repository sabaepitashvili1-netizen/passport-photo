import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  FileDown,
  Printer,
  ChevronDown,
  ChevronUp,
  Award,
  Info
} from 'lucide-react';
import { CountrySpec } from '../types/passport';
import { ComplianceSummary } from '../utils/complianceChecker';

interface ComplianceInspectorProps {
  spec: CountrySpec;
  compliance: ComplianceSummary;
  onOpenPrintSheetModal: () => void;
  onOpenDigitalModal: () => void;
  onOpenCertificateModal: () => void;
}

export const ComplianceInspector: React.FC<ComplianceInspectorProps> = ({
  spec,
  compliance,
  onOpenPrintSheetModal,
  onOpenDigitalModal,
  onOpenCertificateModal,
}) => {
  const [expandedCheckId, setExpandedCheckId] = useState<string | null>(null);

  const toggleCheck = (id: string) => {
    setExpandedCheckId(expandedCheckId === id ? null : id);
  };

  return (
    <div className="bg-white rounded-xl border border-[#3C2F80]/15 shadow-sm p-4 sm:p-6 flex flex-col gap-5">
      
      {/* Header and Compliance Score Gauge */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase font-bold tracking-wider text-[#5C5577] font-sans">
            ICAO & State Dept Biometrics
          </span>
          <span className="text-xs font-semibold text-[#5D3BE0]">
            {compliance.summaryStatus}
          </span>
        </div>

        {/* Big Score Card */}
        <div className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
          compliance.score >= 90
            ? 'bg-emerald-50/60 border-emerald-200'
            : compliance.score >= 75
            ? 'bg-amber-50/60 border-amber-200'
            : 'bg-rose-50/60 border-rose-200'
        }`}>
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-xs ${
              compliance.score >= 90
                ? 'bg-emerald-600 text-white'
                : compliance.score >= 75
                ? 'bg-amber-600 text-white'
                : 'bg-rose-600 text-white'
            }`}>
              {compliance.score}%
            </div>
            <div>
              <h3 className="font-serif font-bold text-[#261569] text-base">
                {compliance.score >= 90 ? 'Official Acceptance Ready' : 'Optimization Advised'}
              </h3>
              <p className="text-xs text-[#5C5577]">
                {compliance.checks.filter(c => c.status === 'passed').length} of {compliance.checks.length} government standards fully verified.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenCertificateModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#3C2F80]/15 hover:border-[#5D3BE0] text-xs font-semibold text-[#261569] shadow-2xs hover:shadow-xs transition-all"
            title="View biometric certificate"
          >
            <Award className="w-4 h-4 text-[#5D3BE0]" />
            <span>Certificate</span>
          </button>
        </div>
      </div>

      {/* Real-time Checklist */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-semibold text-[#261569] px-1">
          <span>Official Checklist ({spec.officialStandard})</span>
          <span className="text-[11px] text-[#5C5577]">Click to inspect</span>
        </div>

        <div className="flex flex-col divide-y divide-[#3C2F80]/10 border border-[#3C2F80]/10 rounded-lg overflow-hidden">
          {compliance.checks.map((check) => {
            const isExpanded = expandedCheckId === check.id;
            return (
              <div key={check.id} className="bg-white">
                <button
                  onClick={() => toggleCheck(check.id)}
                  className="w-full px-3.5 py-2.5 flex items-center justify-between hover:bg-[#FAF8FF] transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5">
                    {check.status === 'passed' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : check.status === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span className="text-xs font-medium text-[#261569]">
                      {check.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-[#5C5577]">
                      {check.currentValue}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5 text-[#797582]" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-[#797582]" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-3.5 pb-3 pt-1 bg-[#FAF8FF] text-xs text-[#5C5577] flex flex-col gap-1 border-t border-[#3C2F80]/5">
                    <div className="flex items-center gap-1.5 text-[#261569] font-medium">
                      <Info className="w-3.5 h-3.5 text-[#5D3BE0]" />
                      <span>Standard Rule: {check.requiredValue}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-[#484551]">
                      {check.guidance}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Delivery & Download Action CTAs */}
      <div className="pt-2 flex flex-col gap-2.5">
        
        {/* 4x6 Printable Sheet (Primary Action) */}
        <button
          onClick={onOpenPrintSheetModal}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-lg bg-[#5D3BE0] hover:bg-[#4E2EC7] text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
        >
          <Printer className="w-4 h-4" />
          <span>Generate 4x6" Printable Sheet</span>
          <span className="text-xs font-normal opacity-90">({spec.sheetCount} photos)</span>
        </button>

        {/* Single Digital Biometric File */}
        <button
          onClick={onOpenDigitalModal}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-lg bg-white border border-[#5D3BE0] text-[#5D3BE0] hover:bg-[#5D3BE0]/5 font-semibold text-xs sm:text-sm transition-all"
        >
          <FileDown className="w-4 h-4" />
          <span>Download Single Digital File (DS-11 / Online Visa)</span>
        </button>

      </div>

      <div className="text-[11px] text-[#797582] text-center">
        Guaranteed compliant with 2026 worldwide immigration and embassy regulations.
      </div>

    </div>
  );
};
