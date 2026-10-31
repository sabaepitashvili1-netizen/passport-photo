import React, { useState } from 'react';
import {
  X,
  Package,
  Mail,
  Truck,
  ShieldCheck,
  Check,
  Stamp,
  Printer,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { CountrySpec, PostalOrderInfo } from '../types/passport';

interface PhysicalOrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  spec: CountrySpec;
  imageSrc: string;
  onOrderCompleted?: (order: PostalOrderInfo) => void;
}

export const PhysicalOrderDrawer: React.FC<PhysicalOrderDrawerProps> = ({
  isOpen,
  onClose,
  spec,
  imageSrc,
  onOrderCompleted,
}) => {
  const [step, setStep] = useState<'details' | 'confirm'>('details');
  const [finish, setFinish] = useState<'matte' | 'lustre'>('lustre');
  const [quantity, setQuantity] = useState<number>(4);
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'priority' | 'express'>('standard');

  const [form, setForm] = useState({
    fullName: 'Jane Doe',
    address1: '742 Evergreen Terrace',
    address2: 'Apt 4B',
    city: 'Springfield',
    state: 'OR',
    postalCode: '97477',
    country: 'United States',
  });

  const [completedOrder, setCompletedOrder] = useState<PostalOrderInfo | null>(null);

  if (!isOpen) return null;

  const getBasePrice = () => {
    return quantity === 4 ? 9.99 : 14.99;
  };

  const getShippingCost = () => {
    if (shippingMethod === 'standard') return 3.5;
    if (shippingMethod === 'priority') return 7.5;
    return 12.0;
  };

  const totalPrice = (getBasePrice() + getShippingCost()).toFixed(2);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const orderId = `EV-${Date.now().toString().slice(-6)}`;
    const trackingNumber = `940011189922${Math.floor(10000000 + Math.random() * 90000000)}`;

    const orderData: PostalOrderInfo = {
      paperFinish: finish,
      quantity,
      price: parseFloat(totalPrice),
      recipientName: form.fullName,
      addressLine1: form.address1,
      addressLine2: form.address2,
      city: form.city,
      stateProvince: form.state,
      postalCode: form.postalCode,
      country: form.country,
      shippingMethod,
      orderId,
      trackingNumber,
    };

    setCompletedOrder(orderData);
    setStep('confirm');

    // Save to local storage for persistence
    try {
      const existing = JSON.parse(localStorage.getItem('earthvoyage_orders') || '[]');
      existing.unshift(orderData);
      localStorage.setItem('earthvoyage_orders', JSON.stringify(existing.slice(0, 10)));
    } catch (err) {
      // ignore
    }

    if (onOrderCompleted) onOrderCompleted(orderData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#261569]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#3C2F80]/15 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#3C2F80]/10 flex items-center justify-between bg-[#FAF8FF]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#261569] text-white flex items-center justify-center shadow-xs">
              <Mail className="w-5 h-5 text-[#E5DEFF]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#261569]">
                Earth Voyage Archival Postal Dispatch
              </h3>
              <p className="text-xs text-[#5C5577]">
                Delivered in our signature protective glassine envelope with certification seal
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto">
          {step === 'details' ? (
            <form onSubmit={handlePlaceOrder} className="flex flex-col gap-6">
              
              {/* Product preview and paper choice */}
              <div className="flex flex-col sm:flex-row gap-5 p-4 rounded-xl bg-[#FAF8FF] border border-[#3C2F80]/10 items-center">
                <div className="w-24 h-24 rounded-lg bg-white border-2 border-dashed border-[#5D3BE0]/40 p-1 flex items-center justify-center shadow-xs shrink-0">
                  <img
                    src={imageSrc}
                    alt="Preview"
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <div className="flex flex-col gap-1 text-xs">
                  <span className="font-serif font-bold text-sm text-[#261569]">
                    {spec.countryName} {spec.documentType} ({spec.widthInches}x{spec.heightInches}")
                  </span>
                  <p className="text-[#5C5577]">
                    Hand-inspected by biometric specialists and printed on heavyweight 280 GSM archival photo stock.
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[#5D3BE0] font-semibold text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>100% Embassy Acceptance Guarantee Included</span>
                  </div>
                </div>
              </div>

              {/* Quantity & Finish Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Quantity */}
                <div>
                  <label className="block text-xs font-bold text-[#261569] mb-1.5">
                    Print Quantity
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setQuantity(4)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        quantity === 4
                          ? 'border-[#5D3BE0] bg-white ring-2 ring-[#5D3BE0]/15'
                          : 'border-slate-200 bg-slate-50 text-[#5C5577] hover:bg-white'
                      }`}
                    >
                      <span className="font-serif font-bold text-sm text-[#261569] block">
                        4 Prints
                      </span>
                      <span className="text-xs text-[#5D3BE0] font-semibold">$9.99</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setQuantity(8)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        quantity === 8
                          ? 'border-[#5D3BE0] bg-white ring-2 ring-[#5D3BE0]/15'
                          : 'border-slate-200 bg-slate-50 text-[#5C5577] hover:bg-white'
                      }`}
                    >
                      <span className="font-serif font-bold text-sm text-[#261569] block">
                        8 Prints
                      </span>
                      <span className="text-xs text-[#5D3BE0] font-semibold">$14.99</span>
                    </button>
                  </div>
                </div>

                {/* Finish */}
                <div>
                  <label className="block text-xs font-bold text-[#261569] mb-1.5">
                    Paper Texture & Finish
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFinish('lustre')}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        finish === 'lustre'
                          ? 'border-[#5D3BE0] bg-white ring-2 ring-[#5D3BE0]/15'
                          : 'border-slate-200 bg-slate-50 text-[#5C5577] hover:bg-white'
                      }`}
                    >
                      <span className="font-serif font-bold text-xs text-[#261569] block">
                        Studio Semi-Gloss
                      </span>
                      <span className="text-[11px] text-[#5C5577]">Official standard</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFinish('matte')}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        finish === 'matte'
                          ? 'border-[#5D3BE0] bg-white ring-2 ring-[#5D3BE0]/15'
                          : 'border-slate-200 bg-slate-50 text-[#5C5577] hover:bg-white'
                      }`}
                    >
                      <span className="font-serif font-bold text-xs text-[#261569] block">
                        Archival Matte
                      </span>
                      <span className="text-[11px] text-[#5C5577]">Tactile paper grain</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Shipping Address Inputs */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#5C5577] mb-3">
                  Postal Delivery Destination
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-[#261569] mb-1">
                      Recipient Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#3C2F80]/20 text-xs text-[#261569] focus:outline-none focus:ring-2 focus:ring-[#5D3BE0]/20"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-[#261569] mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      required
                      value={form.address1}
                      onChange={(e) => setForm({ ...form, address1: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#3C2F80]/20 text-xs text-[#261569] focus:outline-none focus:ring-2 focus:ring-[#5D3BE0]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#261569] mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#3C2F80]/20 text-xs text-[#261569] focus:outline-none focus:ring-2 focus:ring-[#5D3BE0]/20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#261569] mb-1">
                        State / Prov
                      </label>
                      <input
                        type="text"
                        required
                        value={form.state}
                        onChange={(e) => setForm({ ...form, state: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-[#3C2F80]/20 text-xs text-[#261569] focus:outline-none focus:ring-2 focus:ring-[#5D3BE0]/20"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#261569] mb-1">
                        Zip Code
                      </label>
                      <input
                        type="text"
                        required
                        value={form.postalCode}
                        onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-[#3C2F80]/20 text-xs text-[#261569] focus:outline-none focus:ring-2 focus:ring-[#5D3BE0]/20"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Speed Radio */}
              <div>
                <label className="block text-xs font-bold text-[#261569] mb-2">
                  Delivery Speed
                </label>
                <div className="space-y-2">
                  <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-[#5D3BE0] cursor-pointer text-xs">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === 'standard'}
                        onChange={() => setShippingMethod('standard')}
                        className="accent-[#5D3BE0]"
                      />
                      <div>
                        <span className="font-semibold text-[#261569]">USPS First-Class Tracked</span>
                        <span className="text-[#5C5577] block text-[11px]">3–5 business days</span>
                      </div>
                    </div>
                    <span className="font-semibold text-[#261569]">$3.50</span>
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-[#5D3BE0] cursor-pointer text-xs">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === 'priority'}
                        onChange={() => setShippingMethod('priority')}
                        className="accent-[#5D3BE0]"
                      />
                      <div>
                        <span className="font-semibold text-[#261569]">USPS Priority Mail</span>
                        <span className="text-[#5C5577] block text-[11px]">2 business days expedited</span>
                      </div>
                    </div>
                    <span className="font-semibold text-[#261569]">$7.50</span>
                  </label>
                </div>
              </div>

              {/* Pricing summary */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#5C5577] block">Total Order Amount</span>
                  <span className="text-xl font-serif font-bold text-[#261569]">
                    ${totalPrice}
                  </span>
                </div>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#5D3BE0] hover:bg-[#4E2EC7] text-white text-xs sm:text-sm font-semibold shadow-md transition-all active:scale-[0.98]"
                >
                  <span>Dispatch Physical Order</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          ) : (
            /* Order Placed Confirmation: Authentic Postal Dispatch Certificate */
            <div className="flex flex-col items-center gap-6 py-2">
              
              {/* The Postal Card Keepsake Preview */}
              <div className="w-full max-w-lg bg-[#FAF8FF] p-6 rounded-2xl border-2 border-dashed border-[#5D3BE0]/40 relative shadow-md">
                
                {/* Vintage cancellation postmark in top right */}
                <div className="absolute top-4 right-4 w-20 h-20 rounded-full border-2 border-[#5D3BE0]/50 flex flex-col items-center justify-center -rotate-12 select-none pointer-events-none text-[#5D3BE0]">
                  <span className="text-[8px] font-bold tracking-widest uppercase">DISPATCHED</span>
                  <span className="text-[10px] font-bold">USPS</span>
                  <span className="text-[8px] font-mono">{new Date().toISOString().slice(0, 10)}</span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-lg text-[#261569]">
                      Order Confirmed & Queued for Print
                    </h4>
                    <p className="text-xs text-[#5C5577]">
                      Order Ref: {completedOrder?.orderId}
                    </p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#3C2F80]/10 flex flex-col gap-2.5 text-xs text-[#484551] mb-4">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-[#797582]">Postal Tracking:</span>
                    <span className="font-mono font-bold text-[#5D3BE0]">
                      {completedOrder?.trackingNumber}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-[#797582]">Destination:</span>
                    <span className="font-medium text-right text-[#261569]">
                      {completedOrder?.recipientName}, {completedOrder?.city}, {completedOrder?.stateProvince} {completedOrder?.postalCode}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-[#797582]">Items:</span>
                    <span className="font-medium">
                      {completedOrder?.quantity}x {spec.countryName} Photos ({completedOrder?.paperFinish === 'matte' ? 'Archival Matte' : 'Studio Semi-Gloss'})
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-[#261569] pt-1">
                    <span>Total Paid:</span>
                    <span>${completedOrder?.price.toFixed(2)}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Your prints are backed by Earth Voyage 100% Embassy Acceptance or Full Refund Guarantee.</span>
                </div>

              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-[#261569] hover:bg-slate-50 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-lg bg-[#261569] text-white text-xs font-semibold hover:bg-[#1A0E47] transition-colors"
                >
                  Done
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
