import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { UploadSection } from './components/UploadSection';
import { PhotoEditorCanvas } from './components/PhotoEditorCanvas';
import { ComplianceInspector } from './components/ComplianceInspector';
import { PrintSheetModal } from './components/PrintSheetModal';
import { DigitalFileModal } from './components/DigitalFileModal';
import { CountryDirectoryModal } from './components/CountryDirectoryModal';
import { WebcamModal } from './components/WebcamModal';
import { PhysicalOrderDrawer } from './components/PhysicalOrderDrawer';
import { CertificateModal } from './components/CertificateModal';
import { GuaranteedAcceptanceModal } from './components/GuaranteedAcceptanceModal';
import { SavedOrdersModal } from './components/SavedOrdersModal';
import { GuidelineFaqSection } from './components/GuidelineFaqSection';
import { Footer } from './components/Footer';

import { COUNTRY_SPECS } from './data/countries';
import { SAMPLE_PORTRAITS } from './data/samplePortraits';
import { CountrySpec, PhotoAdjustments, PostalOrderInfo } from './types/passport';
import { evaluateCompliance } from './utils/complianceChecker';

import {
  ShieldCheck,
  Printer,
  Sparkles,
  Globe,
  Award,
  CheckCircle2,
  Mail,
  FileCheck
} from 'lucide-react';

export default function App() {
  // Document and active spec
  const [selectedSpec, setSelectedSpec] = useState<CountrySpec>(COUNTRY_SPECS[0]);

  // Photo source: defaults to high quality compliant sample
  const [photoSrc, setPhotoSrc] = useState<string>(SAMPLE_PORTRAITS[0].dataUrl);

  // Editor adjustments
  const [adjustments, setAdjustments] = useState<PhotoAdjustments>({
    zoom: 1.05,
    panX: 0,
    panY: 0,
    rotation: 0,
    brightness: 0,
    contrast: 0,
    backgroundMode: 'white',
    showBiometricGuide: true,
  });

  // Modal open states
  const [isPrintSheetModalOpen, setIsPrintSheetModalOpen] = useState(false);
  const [isDigitalModalOpen, setIsDigitalModalOpen] = useState(false);
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [isWebcamModalOpen, setIsWebcamModalOpen] = useState(false);
  const [isPhysicalOrderOpen, setIsPhysicalOrderOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [isGuaranteeModalOpen, setIsGuaranteeModalOpen] = useState(false);
  const [isSavedOrdersOpen, setIsSavedOrdersOpen] = useState(false);

  // Success toast for notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Evaluate compliance in real time
  const compliance = useMemo(() => {
    return evaluateCompliance(selectedSpec, adjustments);
  }, [selectedSpec, adjustments]);

  // Adjustments updater
  const handleUpdateAdjustments = (newAdj: Partial<PhotoAdjustments>) => {
    setAdjustments((prev) => ({ ...prev, ...newAdj }));
  };

  // Reset to neutral
  const handleReset = () => {
    setAdjustments({
      zoom: 1.0,
      panX: 0,
      panY: 0,
      rotation: 0,
      brightness: 0,
      contrast: 0,
      backgroundMode: 'white',
      showBiometricGuide: true,
    });
    showToast('Reset photo position and alignment');
  };

  // Auto-center portrait
  const handleAutoCenter = () => {
    setAdjustments((prev) => ({
      ...prev,
      panX: 0,
      panY: 0,
      rotation: 0,
      zoom: selectedSpec.widthMm === 51 ? 1.05 : 1.1,
    }));
    showToast('Auto-centered portrait to vertical biometric axis');
  };

  // Photo selected from upload, sample or webcam
  const handleSelectPhoto = (
    src: string,
    initial?: { zoom: number; panX: number; panY: number; rotation: number }
  ) => {
    setPhotoSrc(src);
    if (initial) {
      setAdjustments((prev) => ({
        ...prev,
        zoom: initial.zoom,
        panX: initial.panX,
        panY: initial.panY,
        rotation: initial.rotation,
      }));
    }
    showToast('Photo loaded into studio');
  };

  const handleOrderCompleted = (order: PostalOrderInfo) => {
    showToast(`Order #${order.orderId} placed successfully! Tracking: ${order.trackingNumber}`);
  };

  return (
    <div className="min-h-screen bg-[#FAF8FF] text-[#1A1B20] flex flex-col font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#261569] text-white px-4 py-2.5 rounded-xl shadow-xl border border-[#5D3BE0]/40 flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        currentSpec={selectedSpec}
        onOpenCountryModal={() => setIsCountryModalOpen(true)}
        onOpenSpecsModal={() => setIsCountryModalOpen(true)}
        onOpenGuaranteeModal={() => setIsGuaranteeModalOpen(true)}
        onOpenOrderModal={() => setIsPhysicalOrderOpen(true)}
        onOpenSavedOrders={() => setIsSavedOrdersOpen(true)}
      />

      {/* Hero Intro Header */}
      <section className="bg-gradient-to-b from-[#FAF8FF] via-[#F4F3FA] to-[#FAF8FF] border-b border-[#3C2F80]/10 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              
              {/* Subtle vintage dispatch kicker */}
              <div className="flex items-center gap-2 text-xs font-semibold text-[#5D3BE0] tracking-wide mb-2 uppercase">
                <span className="w-2 h-2 rounded-full bg-[#5D3BE0]" />
                <span>Official Biometric Travel Documentation</span>
                <span aria-hidden="true">·</span>
                <span>ICAO Standard 9303</span>
              </div>

              <h1 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-[#261569] tracking-tight leading-tight">
                Passport & Visa Photo Studio
              </h1>

              <p className="mt-3 text-sm sm:text-base text-[#484551] leading-relaxed font-sans">
                Create 100% compliant official photos calibrated to exact government millimeters. Export high-res 4×6" photo sheets printable for $0.38 at pharmacies, download digital visa files, or order archival prints delivered by mail.
              </p>

              {/* Badges / Guarantees bar */}
              <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-[#261569] font-medium">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#3C2F80]/15 shadow-2xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>100% Embassy Acceptance Guaranteed</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#3C2F80]/15 shadow-2xs">
                  <Printer className="w-4 h-4 text-[#5D3BE0]" />
                  <span>300 DPI Archival Resolution</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#3C2F80]/15 shadow-2xs">
                  <Globe className="w-4 h-4 text-[#5D3BE0]" />
                  <span>50+ Countries Supported</span>
                </div>
              </div>

            </div>

            {/* Quick Country Switcher Card in Hero */}
            <div className="w-full md:w-auto bg-white p-5 rounded-2xl border border-[#3C2F80]/15 shadow-sm flex flex-col gap-3 min-w-[280px]">
              <span className="text-[11px] uppercase font-bold tracking-wider text-[#5C5577]">
                Active Document Profile
              </span>
              
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-[#261569] text-white font-bold flex items-center justify-center font-sans text-xs shadow-xs">
                    {selectedSpec.countryCode}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#261569]">
                      {selectedSpec.countryName}
                    </h3>
                    <p className="text-xs text-[#5C5577]">{selectedSpec.documentType}</p>
                  </div>
                </div>
              </div>

              <div className="text-xs text-[#484551] bg-[#FAF8FF] p-2.5 rounded-lg border border-[#3C2F80]/10 flex flex-col gap-1">
                <div className="flex justify-between">
                  <span className="text-[#797582]">Size:</span>
                  <span className="font-semibold text-[#261569]">{selectedSpec.widthMm}×{selectedSpec.heightMm}mm ({selectedSpec.widthInches}×{selectedSpec.heightInches}")</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#797582]">Background:</span>
                  <span>{selectedSpec.bgRequirement}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#797582]">Head Coverage:</span>
                  <span className="font-medium text-[#5D3BE0]">{selectedSpec.headSizePercentMin}%–{selectedSpec.headSizePercentMax}%</span>
                </div>
              </div>

              <button
                onClick={() => setIsCountryModalOpen(true)}
                className="w-full py-2 px-3 rounded-lg bg-[#FAF8FF] hover:bg-[#F2F0F7] border border-[#3C2F80]/20 text-xs font-semibold text-[#261569] transition-all flex items-center justify-center gap-1.5"
              >
                <Globe className="w-3.5 h-3.5 text-[#5D3BE0]" />
                <span>Switch Country Format</span>
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* Main Studio Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full flex flex-col gap-8">
        
        {/* Step Flow Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-white border border-[#3C2F80]/15 flex items-center gap-2.5 shadow-2xs">
            <span className="w-6 h-6 rounded-full bg-[#261569] text-white flex items-center justify-center font-bold text-xs shrink-0">1</span>
            <div>
              <span className="font-bold text-[#261569] block">Choose Spec</span>
              <span className="text-[#5C5577] text-[11px] truncate block">{selectedSpec.countryName}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-[#3C2F80]/15 flex items-center gap-2.5 shadow-2xs">
            <span className="w-6 h-6 rounded-full bg-[#261569] text-white flex items-center justify-center font-bold text-xs shrink-0">2</span>
            <div>
              <span className="font-bold text-[#261569] block">Upload / Camera</span>
              <span className="text-[#5C5577] text-[11px]">Portrait ready</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-[#5D3BE0] ring-2 ring-[#5D3BE0]/15 flex items-center gap-2.5 shadow-2xs">
            <span className="w-6 h-6 rounded-full bg-[#5D3BE0] text-white flex items-center justify-center font-bold text-xs shrink-0">3</span>
            <div>
              <span className="font-bold text-[#261569] block">Biometrics & Crop</span>
              <span className="text-[#5D3BE0] font-semibold text-[11px]">{compliance.score}% Compliant</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-[#3C2F80]/15 flex items-center gap-2.5 shadow-2xs">
            <span className="w-6 h-6 rounded-full bg-[#261569] text-white flex items-center justify-center font-bold text-xs shrink-0">4</span>
            <div>
              <span className="font-bold text-[#261569] block">Print or Download</span>
              <span className="text-[#5C5577] text-[11px]">4×6 sheet / digital</span>
            </div>
          </div>
        </div>

        {/* 2-Column Responsive Studio Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (7 cols): Upload Section + Interactive Canvas */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Step 1: Upload / Portrait Picker */}
            <UploadSection
              currentPhotoSrc={photoSrc}
              onSelectPhoto={handleSelectPhoto}
              onOpenWebcam={() => setIsWebcamModalOpen(true)}
              spec={selectedSpec}
            />

            {/* Step 2: Interactive Calibration Canvas */}
            <PhotoEditorCanvas
              imageSrc={photoSrc}
              spec={selectedSpec}
              adjustments={adjustments}
              onChangeAdjustments={handleUpdateAdjustments}
              compliance={compliance}
              onAutoCenter={handleAutoCenter}
              onReset={handleReset}
            />

          </div>

          {/* Right Column (5 cols): Biometric Compliance Inspector & CTAs */}
          <div className="lg:col-span-5 sticky top-28 flex flex-col gap-6">
            
            <ComplianceInspector
              spec={selectedSpec}
              compliance={compliance}
              onOpenPrintSheetModal={() => setIsPrintSheetModalOpen(true)}
              onOpenDigitalModal={() => setIsDigitalModalOpen(true)}
              onOpenCertificateModal={() => setIsCertificateModalOpen(true)}
            />

            {/* Tactile Physical Mail Delivery Card */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#FAF8FF] to-[#F4F3FA] border-2 border-dashed border-[#5D3BE0]/30 shadow-xs flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#5D3BE0] text-white flex items-center justify-center shadow-xs">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#261569]">
                    Need physical prints mailed to your home?
                  </h3>
                  <span className="text-xs text-[#5C5577]">
                    Printed on heavyweight archival luster or matte paper
                  </span>
                </div>
              </div>
              <p className="text-xs text-[#484551] leading-relaxed">
                Skip pharmacy lines. We hand-inspect each photo, print in high definition, and dispatch in our protective wax-sealed envelope via USPS Tracked Mail.
              </p>
              <button
                onClick={() => setIsPhysicalOrderOpen(true)}
                className="w-full py-2.5 rounded-lg bg-[#261569] hover:bg-[#1A0E47] text-white text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <span>Order Physical Prints (From $9.99)</span>
              </button>
            </div>

          </div>

        </div>

        {/* Detailed FAQ & Biometric Advice Guidelines */}
        <section className="mt-8">
          <GuidelineFaqSection />
        </section>

      </main>

      {/* Footer */}
      <Footer
        onOpenCountryModal={() => setIsCountryModalOpen(true)}
        onOpenGuaranteeModal={() => setIsGuaranteeModalOpen(true)}
        onOpenOrderModal={() => setIsPhysicalOrderOpen(true)}
      />

      {/* Modals & Dialogs */}
      <PrintSheetModal
        isOpen={isPrintSheetModalOpen}
        onClose={() => setIsPrintSheetModalOpen(false)}
        imageSrc={photoSrc}
        spec={selectedSpec}
        adjustments={adjustments}
        onOpenPhysicalOrder={() => {
          setIsPrintSheetModalOpen(false);
          setIsPhysicalOrderOpen(true);
        }}
      />

      <DigitalFileModal
        isOpen={isDigitalModalOpen}
        onClose={() => setIsDigitalModalOpen(false)}
        imageSrc={photoSrc}
        spec={selectedSpec}
        adjustments={adjustments}
      />

      <CountryDirectoryModal
        isOpen={isCountryModalOpen}
        onClose={() => setIsCountryModalOpen(false)}
        activeSpec={selectedSpec}
        onSelectSpec={(newSpec) => {
          setSelectedSpec(newSpec);
          showToast(`Switched format to ${newSpec.countryName} (${newSpec.widthMm}×${newSpec.heightMm}mm)`);
        }}
      />

      <WebcamModal
        isOpen={isWebcamModalOpen}
        onClose={() => setIsWebcamModalOpen(false)}
        onCapture={(dataUrl) => {
          handleSelectPhoto(dataUrl, {
            zoom: 1.0,
            panX: 0,
            panY: 0,
            rotation: 0,
          });
        }}
      />

      <PhysicalOrderDrawer
        isOpen={isPhysicalOrderOpen}
        onClose={() => setIsPhysicalOrderOpen(false)}
        spec={selectedSpec}
        imageSrc={photoSrc}
        onOrderCompleted={handleOrderCompleted}
      />

      <CertificateModal
        isOpen={isCertificateModalOpen}
        onClose={() => setIsCertificateModalOpen(false)}
        spec={selectedSpec}
        compliance={compliance}
        imageSrc={photoSrc}
      />

      <GuaranteedAcceptanceModal
        isOpen={isGuaranteeModalOpen}
        onClose={() => setIsGuaranteeModalOpen(false)}
      />

      <SavedOrdersModal
        isOpen={isSavedOrdersOpen}
        onClose={() => setIsSavedOrdersOpen(false)}
        onOpenPhysicalOrder={() => {
          setIsSavedOrdersOpen(false);
          setIsPhysicalOrderOpen(true);
        }}
      />

    </div>
  );
}
