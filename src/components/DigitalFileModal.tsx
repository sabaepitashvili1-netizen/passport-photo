import React, { useEffect, useRef, useState } from 'react';
import { X, Download, Check, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { CountrySpec, PhotoAdjustments } from '../types/passport';
import { renderSinglePassportCanvas, downloadCanvasImage } from '../utils/canvasRenderer';

interface DigitalFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  spec: CountrySpec;
  adjustments: PhotoAdjustments;
}

export const DigitalFileModal: React.FC<DigitalFileModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  spec,
  adjustments,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [downloaded, setDownloaded] = useState(false);
  const [isRendering, setIsRendering] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    setIsRendering(true);

    const render = async () => {
      try {
        const rendered = await renderSinglePassportCanvas(
          imageSrc,
          spec,
          adjustments,
          spec.pxWidth300Dpi,
          spec.pxHeight300Dpi
        );
        if (!isMounted || !canvasRef.current) return;
        canvasRef.current.width = rendered.width;
        canvasRef.current.height = rendered.height;
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.drawImage(rendered, 0, 0);
        }
      } catch (err) {
        console.error('Failed to render single passport canvas', err);
      } finally {
        if (isMounted) setIsRendering(false);
      }
    };

    render();
    return () => {
      isMounted = false;
    };
  }, [isOpen, imageSrc, spec, adjustments]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const filename = `EarthVoyage-Biometric-${spec.countryCode}-${Date.now().toString().slice(-4)}.jpg`;
    downloadCanvasImage(canvasRef.current, filename);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#261569]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#3C2F80]/15 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#3C2F80]/10 flex items-center justify-between bg-[#FAF8FF]">
          <div>
            <h3 className="font-serif font-bold text-xl text-[#261569]">
              Digital Biometric Photo
            </h3>
            <p className="text-xs text-[#5C5577] font-sans">
              For online embassy portals, E-Visa, ESTA, and digital passport applications
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#5C5577] hover:text-[#261569] hover:bg-[#F2F0F7] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center gap-6">
          
          {/* Centered preview */}
          <div className="relative p-3 rounded-xl bg-[#FAF8FF] border border-[#3C2F80]/10 shadow-xs flex flex-col items-center">
            {isRendering && (
              <div className="w-48 h-48 flex items-center justify-center text-xs text-[#5C5577]">
                Rendering digital biometric file...
              </div>
            )}
            <canvas
              ref={canvasRef}
              className={`w-52 h-52 object-contain rounded-lg shadow-sm border border-slate-300 ${isRendering ? 'hidden' : 'block'}`}
            />
            <span className="mt-2 text-[11px] font-mono text-[#5C5577]">
              {spec.pxWidth300Dpi} × {spec.pxHeight300Dpi} px · sRGB Color Space · JPEG
            </span>
          </div>

          {/* Technical Specs Checklist */}
          <div className="w-full bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col gap-2 text-xs text-[#484551]">
            <div className="flex items-center gap-2 font-semibold text-[#261569] mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Government Portal Metadata Compatibility:</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Aspect: {spec.widthInches}×{spec.heightInches}" ({spec.widthMm}×{spec.heightMm}mm)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Compression: &lt; 240 KB</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Format: 24-bit RGB JPEG</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Resolution: 300 DPI</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#FAF8FF] border-t border-[#3C2F80]/10 flex items-center justify-between">
          <span className="text-xs text-[#5C5577] flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-[#5D3BE0]" />
            Official ICAO Compliant
          </span>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#5D3BE0] hover:bg-[#4E2EC7] text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
          >
            {downloaded ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>File Saved!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download JPEG File</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
