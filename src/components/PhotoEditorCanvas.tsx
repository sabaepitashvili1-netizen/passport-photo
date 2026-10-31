import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Sliders,
  Eye,
  EyeOff,
  Move,
  Maximize2,
  RefreshCw,
  SunMedium,
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { CountrySpec, PhotoAdjustments } from '../types/passport';
import { ComplianceSummary } from '../utils/complianceChecker';

interface PhotoEditorCanvasProps {
  imageSrc: string;
  spec: CountrySpec;
  adjustments: PhotoAdjustments;
  onChangeAdjustments: (newAdj: Partial<PhotoAdjustments>) => void;
  compliance: ComplianceSummary;
  onAutoCenter: () => void;
  onReset: () => void;
}

export const PhotoEditorCanvas: React.FC<PhotoEditorCanvasProps> = ({
  imageSrc,
  spec,
  adjustments,
  onChangeAdjustments,
  compliance,
  onAutoCenter,
  onReset,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showAdvancedTuning, setShowAdvancedTuning] = useState(false);

  // Compute aspect ratio for document frame
  // e.g. 51x51 = 1:1, 35x45 = 0.777:1, 50x70 = 0.714:1
  const aspectRatio = spec.widthMm / spec.heightMm;

  // Dragging event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - adjustments.panX, y: e.clientY - adjustments.panY });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    // Bound drag to reasonable area
    onChangeAdjustments({
      panX: Math.max(-120, Math.min(120, newX)),
      panY: Math.max(-120, Math.min(120, newY)),
    });
  }, [isDragging, dragStart, onChangeAdjustments]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Touch drag support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - adjustments.panX,
        y: e.touches[0].clientY - adjustments.panY,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const newX = e.touches[0].clientX - dragStart.x;
    const newY = e.touches[0].clientY - dragStart.y;
    onChangeAdjustments({
      panX: Math.max(-120, Math.min(120, newX)),
      panY: Math.max(-120, Math.min(120, newY)),
    });
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    const newZoom = Math.min(2.5, Math.max(0.7, adjustments.zoom + delta));
    onChangeAdjustments({ zoom: Number(newZoom.toFixed(2)) });
  };

  return (
    <div className="bg-white rounded-xl border border-[#3C2F80]/15 shadow-sm p-4 sm:p-6 flex flex-col gap-5">
      
      {/* Top Header Bar for Canvas */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#3C2F80]/10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#5D3BE0]" />
          <h2 className="font-serif font-bold text-lg text-[#261569]">
            Biometric Alignment Canvas
          </h2>
          <span className="text-xs text-[#5C5577] font-sans">
            · {spec.countryName} ({spec.widthMm}×{spec.heightMm}mm)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Guide toggle button */}
          <button
            onClick={() => onChangeAdjustments({ showBiometricGuide: !adjustments.showBiometricGuide })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              adjustments.showBiometricGuide
                ? 'bg-[#E5DEFF] text-[#261569] border-[#5D3BE0]/30 shadow-xs'
                : 'bg-white text-[#5C5577] border-[#3C2F80]/15 hover:bg-slate-50'
            }`}
          >
            {adjustments.showBiometricGuide ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            Biometric Guides
          </button>

          {/* Auto center face */}
          <button
            onClick={onAutoCenter}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#FAF8FF] border border-[#3C2F80]/20 text-[#261569] hover:bg-[#F2F0F7] transition-all"
            title="Auto-align portrait to the center biometric axis"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#5D3BE0]" />
            Auto-Center
          </button>

          {/* Reset button */}
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#5C5577] hover:text-[#261569] hover:bg-slate-100 transition-colors"
            title="Reset position and zoom"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* Main Viewport Container */}
      <div className="flex flex-col lg:flex-row items-center gap-8 justify-center py-2">
        
        {/* The Frame Canvas Display */}
        <div className="relative select-none flex flex-col items-center">
          
          {/* Millimeter measurement banner */}
          <div className="w-full flex justify-between items-center text-[11px] text-[#5C5577] font-mono px-3 mb-1">
            <span>0mm</span>
            <span className="font-semibold text-[#261569]">{spec.widthMm}mm ({spec.widthInches}")</span>
            <span>{spec.widthMm}mm</span>
          </div>

          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
            onWheel={handleWheel}
            style={{
              width: aspectRatio >= 1 ? '340px' : `${Math.round(410 * aspectRatio)}px`,
              height: aspectRatio >= 1 ? `${Math.round(340 / aspectRatio)}px` : '410px',
              backgroundColor:
                adjustments.backgroundMode === 'white'
                  ? '#ffffff'
                  : adjustments.backgroundMode === 'offwhite'
                  ? '#f5f5f7'
                  : adjustments.backgroundMode === 'lightgray'
                  ? '#ececf0'
                  : spec.bgHex || '#ffffff',
            }}
            className={`relative overflow-hidden rounded-lg border-2 shadow-md transition-shadow cursor-grab ${
              isDragging ? 'cursor-grabbing border-[#5D3BE0] shadow-lg ring-4 ring-[#5D3BE0]/15' : 'border-[#3C2F80]/25'
            }`}
          >
            {/* The Image inside */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{
                transform: `translate(${adjustments.panX}px, ${adjustments.panY}px) scale(${adjustments.zoom}) rotate(${adjustments.rotation}deg)`,
                transformOrigin: 'center center',
                transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                filter: `brightness(${100 + adjustments.brightness}%) contrast(${100 + adjustments.contrast}%)`,
              }}
            >
              <img
                src={imageSrc}
                alt="Passport Subject"
                className="w-full h-full object-cover select-none pointer-events-none"
                draggable={false}
              />
            </div>

            {/* Official Biometric Guidelines Overlay */}
            {adjustments.showBiometricGuide && (
              <div className="absolute inset-0 pointer-events-none">
                
                {/* Vertical Center Axis */}
                <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-[#5D3BE0]/60 border-l border-dashed border-[#5D3BE0]" />

                {/* Crown / Top of Head Line (approx 12-14% from top) */}
                <div className="absolute left-4 right-4 top-[14%] border-t border-dashed border-[#5D3BE0]/70 flex justify-between px-1">
                  <span className="text-[9px] font-semibold text-[#5D3BE0] bg-white/80 px-1 rounded -translate-y-1/2">
                    Crown (Top of Head)
                  </span>
                  <span className="text-[9px] font-mono text-[#5D3BE0] bg-white/80 px-1 rounded -translate-y-1/2">
                    Max Limit
                  </span>
                </div>

                {/* Eye Level Line (approx 42-45% from top) */}
                <div className="absolute left-2 right-2 top-[44%] border-t-2 border-[#5D3BE0] flex justify-between px-1">
                  <span className="text-[9px] font-bold text-[#261569] bg-[#E5DEFF] px-1.5 py-0.5 rounded -translate-y-1/2 shadow-xs">
                    Eye Line (Level)
                  </span>
                  <span className="text-[9px] font-semibold text-[#5D3BE0] bg-white/90 px-1 rounded -translate-y-1/2">
                    Must be horizontal
                  </span>
                </div>

                {/* Chin Guide Line (approx 72-76% from top) */}
                <div className="absolute left-4 right-4 top-[74%] border-t border-dashed border-[#5D3BE0]/70 flex justify-between px-1">
                  <span className="text-[9px] font-semibold text-[#5D3BE0] bg-white/80 px-1 rounded -translate-y-1/2">
                    Base of Chin
                  </span>
                  <span className="text-[9px] font-mono text-[#5D3BE0] bg-white/80 px-1 rounded -translate-y-1/2">
                    Min Limit
                  </span>
                </div>

                {/* Biometric Oval Head Silhouette Guide */}
                <div className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 w-[54%] h-[62%] rounded-[50%/55%] border-2 border-[#5D3BE0]/60 shadow-[0_0_0_9999px_rgba(38,21,105,0.06)]" />

                {/* Corner registration tick marks */}
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#3C2F80]/50" />
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#3C2F80]/50" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#3C2F80]/50" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#3C2F80]/50" />
              </div>
            )}

            {/* Bottom floating pan hint */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded bg-[#1A1B20]/70 backdrop-blur-xs text-white text-[10px] font-medium flex items-center gap-1 pointer-events-none">
              <Move className="w-3 h-3" />
              <span>Drag to position · Scroll to zoom</span>
            </div>

            {/* Live compliance badge in upper corner */}
            <div className="absolute top-2.5 right-2.5 pointer-events-none">
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold shadow-md backdrop-blur-md ${
                compliance.score >= 90
                  ? 'bg-emerald-600/90 text-white'
                  : compliance.score >= 75
                  ? 'bg-amber-600/90 text-white'
                  : 'bg-rose-600/90 text-white'
              }`}>
                {compliance.score >= 90 ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5" />
                )}
                <span>{compliance.score}% Valid</span>
              </div>
            </div>

          </div>

          {/* Millimeter vertical measurement side indicator */}
          <div className="w-full flex justify-between items-center text-[11px] text-[#5C5577] font-mono px-3 mt-1">
            <span>0mm</span>
            <span className="font-semibold text-[#261569]">{spec.heightMm}mm ({spec.heightInches}")</span>
            <span>{spec.heightMm}mm</span>
          </div>
        </div>

        {/* Right / Side Interactive Controls */}
        <div className="w-full lg:w-72 flex flex-col gap-4">
          
          {/* Zoom Slider */}
          <div className="p-3.5 rounded-lg bg-[#FAF8FF] border border-[#3C2F80]/10">
            <div className="flex items-center justify-between text-xs font-semibold text-[#261569] mb-2">
              <span className="flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-[#5D3BE0]" />
                Face Scale / Zoom
              </span>
              <span className="font-mono text-[#5C5577]">{Math.round(adjustments.zoom * 100)}%</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onChangeAdjustments({ zoom: Math.max(0.7, Number((adjustments.zoom - 0.05).toFixed(2))) })}
                className="p-1.5 rounded bg-white border border-[#3C2F80]/15 text-[#261569] hover:bg-slate-50"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <input
                type="range"
                min="0.7"
                max="2.2"
                step="0.02"
                value={adjustments.zoom}
                onChange={(e) => onChangeAdjustments({ zoom: parseFloat(e.target.value) })}
                className="w-full accent-[#5D3BE0] cursor-pointer"
              />
              <button
                onClick={() => onChangeAdjustments({ zoom: Math.min(2.5, Number((adjustments.zoom + 0.05).toFixed(2))) })}
                className="p-1.5 rounded bg-white border border-[#3C2F80]/15 text-[#261569] hover:bg-slate-50"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Head Tilt / Angle Slider */}
          <div className="p-3.5 rounded-lg bg-[#FAF8FF] border border-[#3C2F80]/10">
            <div className="flex items-center justify-between text-xs font-semibold text-[#261569] mb-2">
              <span className="flex items-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5 text-[#5D3BE0]" />
                Head Tilt / Rotation
              </span>
              <span className={`font-mono text-xs ${Math.abs(adjustments.rotation) > 2 ? 'text-amber-700 font-bold' : 'text-[#5C5577]'}`}>
                {adjustments.rotation > 0 ? '+' : ''}{adjustments.rotation.toFixed(1)}°
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="-15"
                max="15"
                step="0.5"
                value={adjustments.rotation}
                onChange={(e) => onChangeAdjustments({ rotation: parseFloat(e.target.value) })}
                className="w-full accent-[#5D3BE0] cursor-pointer"
              />
              <button
                onClick={() => onChangeAdjustments({ rotation: 0 })}
                className="px-2 py-1 text-[11px] font-semibold rounded bg-white border border-[#3C2F80]/15 text-[#5C5577] hover:text-[#261569]"
                title="Reset angle to 0"
              >
                0°
              </button>
            </div>
          </div>

          {/* Background Replacement Mode */}
          <div className="p-3.5 rounded-lg bg-[#FAF8FF] border border-[#3C2F80]/10">
            <span className="block text-xs font-semibold text-[#261569] mb-2">
              Background Color Preset
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => onChangeAdjustments({ backgroundMode: 'white' })}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium border text-left transition-all ${
                  adjustments.backgroundMode === 'white'
                    ? 'bg-white border-[#5D3BE0] text-[#261569] shadow-xs ring-2 ring-[#5D3BE0]/15'
                    : 'bg-white/60 border-slate-200 text-[#5C5577] hover:bg-white'
                }`}
              >
                <div className="w-3.5 h-3.5 rounded-full border border-slate-300 bg-white" />
                <span>Pure White</span>
              </button>
              <button
                onClick={() => onChangeAdjustments({ backgroundMode: 'offwhite' })}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium border text-left transition-all ${
                  adjustments.backgroundMode === 'offwhite'
                    ? 'bg-white border-[#5D3BE0] text-[#261569] shadow-xs ring-2 ring-[#5D3BE0]/15'
                    : 'bg-white/60 border-slate-200 text-[#5C5577] hover:bg-white'
                }`}
              >
                <div className="w-3.5 h-3.5 rounded-full border border-slate-300 bg-[#F5F5F7]" />
                <span>Off-White</span>
              </button>
              <button
                onClick={() => onChangeAdjustments({ backgroundMode: 'lightgray' })}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium border text-left transition-all ${
                  adjustments.backgroundMode === 'lightgray'
                    ? 'bg-white border-[#5D3BE0] text-[#261569] shadow-xs ring-2 ring-[#5D3BE0]/15'
                    : 'bg-white/60 border-slate-200 text-[#5C5577] hover:bg-white'
                }`}
              >
                <div className="w-3.5 h-3.5 rounded-full border border-slate-300 bg-[#ECECF0]" />
                <span>Light Grey</span>
              </button>
              <button
                onClick={() => onChangeAdjustments({ backgroundMode: 'original' })}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium border text-left transition-all ${
                  adjustments.backgroundMode === 'original'
                    ? 'bg-white border-[#5D3BE0] text-[#261569] shadow-xs ring-2 ring-[#5D3BE0]/15'
                    : 'bg-white/60 border-slate-200 text-[#5C5577] hover:bg-white'
                }`}
              >
                <div className="w-3.5 h-3.5 rounded-full border border-slate-300 bg-gradient-to-tr from-amber-100 to-indigo-100" />
                <span>Original</span>
              </button>
            </div>
          </div>

          {/* Advanced Lighting & Exposure Accordion */}
          <div>
            <button
              onClick={() => setShowAdvancedTuning(!showAdvancedTuning)}
              className="w-full flex items-center justify-between text-xs font-semibold text-[#5C5577] hover:text-[#261569] py-1 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <SunMedium className="w-3.5 h-3.5 text-[#5D3BE0]" />
                Fine Exposure & Contrast
              </span>
              <Sliders className="w-3 h-3" />
            </button>

            {showAdvancedTuning && (
              <div className="mt-2 p-3 rounded-lg bg-[#FAF8FF] border border-[#3C2F80]/10 flex flex-col gap-3">
                <div>
                  <div className="flex justify-between text-[11px] text-[#5C5577] mb-1">
                    <span>Brightness</span>
                    <span>{adjustments.brightness > 0 ? '+' : ''}{adjustments.brightness}</span>
                  </div>
                  <input
                    type="range"
                    min="-30"
                    max="30"
                    step="1"
                    value={adjustments.brightness}
                    onChange={(e) => onChangeAdjustments({ brightness: parseInt(e.target.value) })}
                    className="w-full accent-[#5D3BE0] cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-[#5C5577] mb-1">
                    <span>Contrast</span>
                    <span>{adjustments.contrast > 0 ? '+' : ''}{adjustments.contrast}</span>
                  </div>
                  <input
                    type="range"
                    min="-30"
                    max="30"
                    step="1"
                    value={adjustments.contrast}
                    onChange={(e) => onChangeAdjustments({ contrast: parseInt(e.target.value) })}
                    className="w-full accent-[#5D3BE0] cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
