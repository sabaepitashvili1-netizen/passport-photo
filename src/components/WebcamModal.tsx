import React, { useRef, useState, useEffect } from 'react';
import { X, Camera, RefreshCw, Check, AlertCircle, Timer } from 'lucide-react';
import { playShutterSound } from '../utils/canvasRenderer';

interface WebcamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (dataUrl: string) => void;
}

export const WebcamModal: React.FC<WebcamModalProps> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  // Start webcam when opened
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    setCameraError(null);
    setCapturedPhoto(null);
    setCountdown(null);

    const startCamera = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera access is not supported by your browser.');
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (!isMounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn('Webcam permission or device error:', err);
        setCameraError(
          'Unable to access camera. Please allow camera permissions or upload a portrait from your device.'
        );
      }
    };

    startCamera();

    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen, facingMode]);

  if (!isOpen) return null;

  const triggerCapture = () => {
    if (!videoRef.current) return;
    playShutterSound();

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Flip horizontally if facingMode is user
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    setCapturedPhoto(dataUrl);
  };

  const handleStartTimer = () => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          triggerCapture();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleConfirmPhoto = () => {
    if (capturedPhoto) {
      onCapture(capturedPhoto);
      onClose();
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
  };

  const handleToggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#261569]/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#3C2F80]/15 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#3C2F80]/10 flex items-center justify-between bg-[#FAF8FF]">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#261569]">
              Live Biometric Photo Booth
            </h3>
            <p className="text-xs text-[#5C5577]">
              Align your eyes with the dashed level line and look straight into camera
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#5C5577] hover:text-[#261569] hover:bg-[#F2F0F7] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport Area */}
        <div className="relative bg-slate-950 flex items-center justify-center min-h-[380px] overflow-hidden">
          
          {cameraError ? (
            <div className="p-8 text-center flex flex-col items-center gap-3 text-white max-w-md">
              <AlertCircle className="w-10 h-10 text-rose-400" />
              <p className="text-sm font-medium">{cameraError}</p>
              <button
                onClick={onClose}
                className="mt-2 px-4 py-2 bg-white text-[#261569] rounded-lg font-semibold text-xs shadow hover:bg-slate-100 transition-colors"
              >
                Choose Sample or Upload File
              </button>
            </div>
          ) : capturedPhoto ? (
            /* Review captured photo */
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={capturedPhoto}
                alt="Captured Snapshot"
                className="max-h-[420px] object-contain shadow-2xl"
              />
              <div className="absolute top-4 left-4 px-3 py-1 bg-emerald-600/90 text-white rounded-md text-xs font-semibold backdrop-blur-xs flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                Snapshot Captured
              </div>
            </div>
          ) : (
            /* Live Stream with Biometric Head Guide */
            <div className="relative w-full h-[420px] flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
              />

              {/* Countdown overlay */}
              {countdown !== null && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center">
                  <span className="font-serif font-bold text-7xl text-white animate-pulse">
                    {countdown}
                  </span>
                </div>
              )}

              {/* Biometric Head Silhouette Guides on Video */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {/* Center vertical axis */}
                <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-white/40 border-l border-dashed border-white/60" />

                {/* Eye level line */}
                <div className="absolute left-8 right-8 top-[40%] border-t-2 border-emerald-400/80 flex justify-between px-2">
                  <span className="text-[10px] font-bold text-emerald-300 bg-black/60 px-1.5 py-0.5 rounded -translate-y-1/2">
                    Eye Line
                  </span>
                  <span className="text-[10px] font-bold text-emerald-300 bg-black/60 px-1.5 py-0.5 rounded -translate-y-1/2">
                    Level
                  </span>
                </div>

                {/* Head oval */}
                <div className="w-[240px] h-[310px] rounded-[50%/52%] border-2 border-emerald-400/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]" />

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/70 backdrop-blur-xs rounded-full text-white text-[11px] font-medium">
                  Keep neutral expression · Mouth closed · Look directly at lens
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Controls */}
        <div className="px-6 py-4 bg-[#FAF8FF] border-t border-[#3C2F80]/10 flex items-center justify-between">
          
          <button
            onClick={handleToggleFacingMode}
            disabled={!!capturedPhoto || !!cameraError}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#5C5577] hover:text-[#261569] disabled:opacity-40 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Switch Camera</span>
          </button>

          {capturedPhoto ? (
            <div className="flex items-center gap-3">
              <button
                onClick={handleRetake}
                className="px-4 py-2 text-xs font-semibold text-[#5C5577] hover:text-[#261569] hover:bg-slate-100 rounded-lg transition-colors"
              >
                Retake
              </button>
              <button
                onClick={handleConfirmPhoto}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-[#5D3BE0] hover:bg-[#4E2EC7] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Use This Photo</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={handleStartTimer}
                disabled={!!cameraError || countdown !== null}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-[#3C2F80]/20 text-[#261569] text-xs font-semibold hover:bg-slate-50 transition-all disabled:opacity-40"
              >
                <Timer className="w-4 h-4 text-[#5D3BE0]" />
                <span>3s Timer</span>
              </button>

              <button
                onClick={triggerCapture}
                disabled={!!cameraError}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#5D3BE0] hover:bg-[#4E2EC7] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-40"
              >
                <Camera className="w-4 h-4" />
                <span>Take Photo</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
