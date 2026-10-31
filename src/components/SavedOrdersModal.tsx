import React, { useState, useEffect } from 'react';
import { X, Package, Truck, ExternalLink, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { PostalOrderInfo } from '../types/passport';

interface SavedOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPhysicalOrder: () => void;
}

export const SavedOrdersModal: React.FC<SavedOrdersModalProps> = ({
  isOpen,
  onClose,
  onOpenPhysicalOrder,
}) => {
  const [orders, setOrders] = useState<PostalOrderInfo[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    try {
      const stored = JSON.parse(localStorage.getItem('earthvoyage_orders') || '[]');
      setOrders(stored);
    } catch (e) {
      setOrders([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#261569]/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#3C2F80]/15 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#3C2F80]/10 flex items-center justify-between bg-[#FAF8FF]">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#261569]">
              Recent Keepsake Orders & Dispatches
            </h3>
            <p className="text-xs text-[#5C5577]">
              View your tracked postal mail shipments and receipts
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#5C5577] hover:text-[#261569] hover:bg-[#F2F0F7] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Orders list */}
        <div className="p-6 overflow-y-auto flex flex-col gap-4">
          {orders.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center gap-3 text-[#5C5577]">
              <Package className="w-12 h-12 text-[#5D3BE0]/40" />
              <div>
                <h4 className="font-serif font-bold text-base text-[#261569]">No Recent Orders Yet</h4>
                <p className="text-xs max-w-xs mt-1">
                  Once you order physical keepsake prints shipped to your home, they will appear here with live USPS tracking codes.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenPhysicalOrder();
                }}
                className="mt-2 px-4 py-2 bg-[#5D3BE0] text-white rounded-lg text-xs font-semibold hover:bg-[#4E2EC7] transition-colors"
              >
                Place Physical Print Order
              </button>
            </div>
          ) : (
            orders.map((order, idx) => (
              <div
                key={order.orderId || idx}
                className="p-4 rounded-xl border border-[#3C2F80]/15 bg-[#FAF8FF] flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#261569] text-white flex items-center justify-center">
                      <Truck className="w-4 h-4 text-[#E5DEFF]" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-[#261569] block">
                        Order #{order.orderId}
                      </span>
                      <span className="text-[11px] text-[#5C5577]">
                        {order.quantity} Prints ({order.paperFinish === 'matte' ? 'Archival Matte' : 'Studio Luster'})
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#5D3BE0]">${order.price.toFixed(2)}</span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs flex flex-col gap-1 text-[#484551]">
                  <div className="flex justify-between">
                    <span className="text-[#797582]">Postal Tracking:</span>
                    <span className="font-mono font-semibold text-[#261569]">{order.trackingNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#797582]">Shipping To:</span>
                    <span className="truncate max-w-[240px]">{order.recipientName}, {order.city}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                    <span className="text-[#797582]">Status:</span>
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Dispatched / In Transit
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#FAF8FF] border-t border-[#3C2F80]/10 flex justify-between items-center text-xs">
          <span className="text-[#797582]">USPS First Class & Priority Mail</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-[#3C2F80]/20 text-[#261569] rounded-lg font-medium hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
