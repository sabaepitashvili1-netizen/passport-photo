import React, { useRef, useState } from 'react';
import { UploadCloud, Camera, Image as ImageIcon, Sparkles, Check } from 'lucide-react';
import { SAMPLE_PORTRAITS, SamplePortrait } from '../data/samplePortraits';
import { CountrySpec } from '../types/passport';

interface UploadSectionProps {
  currentPhotoSrc: string;
  onSelectPhoto: (src: string, initialAdjustments?: { zoom: number; panX: number; panY: number; rotation: number }) => void;
  onOpenWebcam: () => void;
  spec: CountrySpec;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  currentPhotoSrc,
  onSelectPhoto,
  onOpenWebcam,
  spec,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onSelectPhoto(event.target.result as string, {
            zoom: 1.0,
            panX: 0,
            panY: 0,
            rotation: 0,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onSelectPhoto(event.target.result as string, {
            zoom: 1.0,
            panX: 0,
            panY: 0,
            rotation: 0,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#3C2F80]/15 shadow-sm p-4 sm:p-6 flex flex-col gap-5">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#3C2F80]/10">
        <div>
          <h2 className="font-serif font-bold text-lg text-[#261569]">
            Step 1: Provide or Capture Portrait
          </h2>
          <p className="text-xs text-[#5C5577] font-sans">
            Upload from device, capture with camera, or select a test portrait
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenWebcam}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#FAF8FF] border border-[#5D3BE0]/30 hover:border-[#5D3BE0] text-xs font-semibold text-[#261569] shadow-2xs hover:bg-[#F2F0F7] transition-all"
          >
            <Camera className="w-4 h-4 text-[#5D3BE0]" />
            <span>Open Webcam</span>
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#5D3BE0] hover:bg-[#4E2EC7] text-white text-xs font-semibold shadow-xs transition-all"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Photo</span>
          </button>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
      />

      {/* Drag & Drop Hero Box */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
          isDragOver
            ? 'border-[#5D3BE0] bg-[#E5DEFF]/20 ring-4 ring-[#5D3BE0]/15 scale-[1.01]'
            : 'border-[#3C2F80]/20 bg-[#FAF8FF]/60 hover:bg-[#FAF8FF] hover:border-[#5D3BE0]'
        }`}
      >
        <div className="w-12 h-12 rounded-full bg-white border border-[#3C2F80]/15 flex items-center justify-center mb-3 shadow-xs text-[#5D3BE0]">
          <UploadCloud className="w-6 h-6" />
        </div>
        <h3 className="font-serif font-bold text-base text-[#261569]">
          Drag & drop your portrait here
        </h3>
        <p className="text-xs text-[#5C5577] mt-1 max-w-sm">
          Supports JPG, PNG, or WEBP up to 25 MB. We automatically inspect head size and calibrate {spec.widthMm}×{spec.heightMm}mm boundaries.
        </p>
      </div>

      {/* Instant Test Sample Portraits */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold text-[#261569] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#5D3BE0]" />
            Or try with sample test portraits:
          </span>
          <span className="text-[11px] text-[#797582]">Click any portrait to inspect</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {SAMPLE_PORTRAITS.map((sample) => {
            const isSelected = currentPhotoSrc === sample.dataUrl;
            return (
              <button
                key={sample.id}
                onClick={() => onSelectPhoto(sample.dataUrl, sample.initialAdjustments)}
                className={`p-2 rounded-lg border text-left transition-all flex flex-col items-center group ${
                  isSelected
                    ? 'border-[#5D3BE0] bg-[#FAF8FF] ring-2 ring-[#5D3BE0]/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-[#5D3BE0]/40 hover:bg-slate-50'
                }`}
              >
                <div className="relative w-16 h-16 rounded-md overflow-hidden border border-slate-200 mb-1.5 bg-white">
                  <img
                    src={sample.dataUrl}
                    alt={sample.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#5D3BE0] text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
                <span className="font-serif font-semibold text-xs text-[#261569] text-center truncate w-full">
                  {sample.name}
                </span>
                <span className="text-[10px] text-[#797582] text-center line-clamp-1">
                  {sample.description.slice(0, 24)}...
                </span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
