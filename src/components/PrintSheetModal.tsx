import React, { useEffect, useRef, useState } from 'react';
import { X, Download, Printer, Check, Info, Mail, Sparkles } from 'lucide-react';
import { CountrySpec, PhotoAdjustments } from '../types/passport';
import { render4x6SheetCanvas, downloadCanvasImage } from '../utils/canvasRenderer';

interface PrintSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  spec: CountrySpec;
  adjustments: PhotoAdjustments;
  onOpenPhysicalOrder: () => void;
}

export const PrintSheetModal: React.FC<PrintSheetModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  spec,
  adjustments,
  onOpenPhysicalOrder,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRendering, setIsRendering] = useState(true);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'kiosk-tips'>('preview');

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    setIsRendering(true);

    const render = async () => {
      try {
        const renderedCanvas = await render4x6SheetCanvas(imageSrc, spec, adjustments);
        if (!isMounted || !canvasRef.current) return;
        const target = canvasRef.current;
        target.width = renderedCanvas.width;
        target.height = renderedCanvas.height;
        const ctx = target.getContext('2d');
        if (ctx) {
          ctx.drawImage(renderedCanvas, 0, 0);
        }
      } catch (err) {
        console.error('Failed to render 4x6 sheet', err);
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
    const filename = `EarthVoyage-4x6-Sheet-${spec.countryCode}-${Date.now().toString().slice(-4)}.jpg`;
    downloadCanvasImage(canvasRef.current, filename);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#261569]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#3C2F80]/15 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#3C2F80]/10 flex items-center justify-between bg-[#FAF8FF]">
          <div>
            <h3 className="font-serif font-bold text-xl text-[#261569]">
              4×6" (10×15cm) Standard Photo Sheet
            </h3>
            <p className="text-xs text-[#5C5577] font-sans mt-0.5">
              Contains {spec.sheetCount} certified photos with fine cutting guides · 300 DPI Archival Resolution
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#5C5577] hover:text-[#261569] hover:bg-[#F2F0F7] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('preview')}
            className={`py-2.5 px-4 border-b-2 transition-all ${
              activeTab === 'preview'
                ? 'border-[#5D3BE0] text-[#261569] bg-white'
                : 'border-transparent text-[#5C5577] hover:text-[#261569]'
            }`}
          >
            Sheet Preview
          </button>
          <button
            onClick={() => setActiveTab('kiosk-tips')}
            className={`py-2.5 px-4 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'kiosk-tips'
                ? 'border-[#5D3BE0] text-[#261569] bg-white'
                : 'border-transparent text-[#5C5577] hover:text-[#261569]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#5D3BE0]" />
            $0.38 Kiosk Printing Guide (CVS/Walgreens)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex flex-col items-center gap-6">
          
          {activeTab === 'preview' ? (
            <>
              {/* Sheet Canvas Preview Container */}
              <div className="w-full flex justify-center bg-[#F7F5FC] p-4 rounded-xl border border-[#3C2F80]/10 shadow-inner">
                {isRendering ? (
                  <div className="h-64 flex flex-col items-center justify-center gap-3 text-sm text-[#5C5577]">
                    <div className="w-8 h-8 rounded-full border-2 border-[#5D3BE0] border-t-transparent animate-spin" />
                    <span>Assembling 300 DPI high-resolution sheet...</span>
                  </div>
                ) : null}
                <canvas
                  id="printable-photo-sheet"
                  ref={canvasRef}
                  className={`max-w-full max-h-[50vh] object-contain rounded-md shadow-md border border-[#D1CADF] bg-white ${
                    isRendering ? 'hidden' : 'block'
                  }`}
                />
              </div>

              {/* Instructions and Specs */}
              <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-[#5C5577]">
                <div className="p-3 rounded-lg bg-[#FAF8FF] border border-[#3C2F80]/10">
                  <span className="font-bold text-[#261569] block mb-1">Standard Dimensions</span>
                  Each photo measures exactly {spec.widthMm}×{spec.heightMm}mm ({spec.widthInches}×{spec.heightInches}").
                </div>
                <div className="p-3 rounded-lg bg-[#FAF8FF] border border-[#3C2F80]/10">
                  <span className="font-bold text-[#261569] block mb-1">Print Size Selection</span>
                  Choose 4×6 inch (10×15 cm) paper. Always set scaling to 100% or "Do Not Fit".
                </div>
                <div className="p-3 rounded-lg bg-[#FAF8FF] border border-[#3C2F80]/10">
                  <span className="font-bold text-[#261569] block mb-1">Cutting Guidelines</span>
                  Cut along the thin crosshair lines on the perimeter of each photo with a craft knife or scissors.
                </div>
              </div>
            </>
          ) : (
            /* Kiosk Tips Tab */
            <div className="w-full flex flex-col gap-4 text-xs text-[#484551] leading-relaxed">
              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200">
                <h4 className="font-serif font-bold text-base text-[#261569] mb-1">
                  How to print for under $0.40 at any pharmacy or photo kiosk
                </h4>
                <p>
                  Pharmacies often charge $16.99+ if you ask for "Passport Photos". However, this 4×6" sheet is a standard digital photo print! You can print it as an ordinary 4×6 photo for just $0.35 – $0.45:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
                  <span className="font-bold text-[#261569] block mb-1">1. Save File to Phone or USB</span>
                  Click "Download High-Res Sheet" below and save the JPG file to your camera roll or USB stick.
                </div>
                <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
                  <span className="font-bold text-[#261569] block mb-1">2. Upload Online or Visit Kiosk</span>
                  Order online via CVS Photo, Walgreens, Boots, or Walmart Photo as a "Standard 4×6 Print".
                </div>
                <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
                  <span className="font-bold text-[#261569] block mb-1">3. Select Semi-Gloss or Glossy</span>
                  Government guidelines accept both matte and glossy photo finishes. Semi-gloss is ideal.
                </div>
                <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
                  <span className="font-bold text-[#261569] block mb-1">4. Cut Out Photos</span>
                  Use the scissors or paper cutter available at the photo counter along our alignment guides.
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-[#FAF8FF] border-t border-[#3C2F80]/10 flex flex-wrap items-center justify-between gap-3">
          
          <button
            onClick={onOpenPhysicalOrder}
            className="flex items-center gap-2 text-xs font-semibold text-[#5D3BE0] hover:text-[#261569] transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span>Prefer us to print & mail archival copies? Click here</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-white border border-[#3C2F80]/20 text-[#261569] hover:bg-slate-50 text-xs font-semibold shadow-2xs transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Directly</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#5D3BE0] hover:bg-[#4E2EC7] text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download High-Res 4×6 Sheet</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
