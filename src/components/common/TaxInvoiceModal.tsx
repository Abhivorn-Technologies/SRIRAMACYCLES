'use client';

import React from 'react';
import { Printer, X, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { IOrder } from '@/types';
import { formatPrice, formatDate, formatDateTime } from '@/lib/utils';
import { APP_NAME, STORE_CONTACT } from '@/lib/constants';

interface ITaxInvoiceModalProps {
  order: IOrder;
  isOpen: boolean;
  onClose: () => void;
}

export default function TaxInvoiceModal({ order, isOpen, onClose }: ITaxInvoiceModalProps) {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = `INV-${order.orderNumber.replace('SRC-', '')}`;
  const orderDate = formatDate(order.createdAt || new Date().toISOString());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Modal Top Actions Header (Hidden during browser print) */}
        <div className="print:hidden p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-slate-900 tracking-tight">
              Official Tax Invoice
            </span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
              GST Compliant
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold py-2 px-4 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Tax Invoice Content */}
        <div className="p-6 sm:p-10 overflow-y-auto print:p-0 print:overflow-visible flex flex-col gap-6 text-slate-800 font-sans">
          
          {/* Header Store Branding */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg font-black tracking-tight text-slate-900 uppercase">
                  SRI RAMA <span className="text-brand-600">CYCLE & AUTO SPARE PARTS</span>
                </span>
              </div>
              <p className="text-xs font-bold text-slate-500">
                Since 1976 • Authorised Bicycle & Auto Spare Parts Dealer
              </p>
              <p className="text-xs text-slate-600 mt-1">
                {STORE_CONTACT.address}
              </p>
              <p className="text-xs text-slate-600">
                Phone: <strong>{STORE_CONTACT.phone}</strong> | Email: <strong>{STORE_CONTACT.supportEmail}</strong>
              </p>
              <p className="text-xs text-slate-500 mt-0.5 font-mono">
                GSTIN: <strong>36AAAAA0000A1Z5</strong> (Telangana)
              </p>
            </div>

            <div className="text-left sm:text-right bg-slate-50 p-4 rounded-2xl border border-slate-200/80 shrink-0 print:border-none print:bg-transparent">
              <span className="text-xs font-black uppercase text-brand-700 tracking-wider block">TAX INVOICE</span>
              <p className="text-sm font-black text-slate-900 mt-1">Invoice #: {invoiceNumber}</p>
              <p className="text-xs text-slate-600">Date: {orderDate}</p>
              <p className="text-xs text-slate-600">Order Reference: <strong className="font-mono">{order.orderNumber}</strong></p>
              <span className="inline-block mt-2 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Payment Status: PAID ({order.paymentMethod})
              </span>
            </div>
          </div>

          {/* Customer & Shipping Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 text-xs">
            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
                Billed To (Customer Details)
              </span>
              <h4 className="font-bold text-slate-900 text-sm">{order.customer.name}</h4>
              <p className="text-slate-600">{order.customer.phone}</p>
              <p className="text-slate-600">{order.customer.email}</p>
            </div>
            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
                Delivery Address
              </span>
              <p className="font-bold text-slate-900">
                {order.shippingAddress.street}
                {order.shippingAddress.landmark ? `, ${order.shippingAddress.landmark}` : ''}
              </p>
              <p className="text-slate-600">
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </p>
              <p className="text-slate-600 mt-0.5">Type: {order.shippingAddress.addressType || 'Home'}</p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-300 bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">#</th>
                  <th className="py-3 px-3">Item Description</th>
                  <th className="py-3 px-3 text-center">Qty</th>
                  <th className="py-3 px-3 text-right">Unit Price</th>
                  <th className="py-3 px-3 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 font-semibold text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-900">{item.name}</p>
                      {((item as any).variant?.color || (item as any).selectedColor || (item as any).color) && (
                        <p className="text-[10px] text-amber-800 font-semibold">
                          Color: {(item as any).variant?.color || (item as any).selectedColor || (item as any).color}
                        </p>
                      )}
                      {(item.variant?.size || (item as any).selectedSize || (item as any).size) && (
                        <p className="text-[10px] text-slate-500 font-medium">
                          Size: {item.variant?.size || (item as any).selectedSize || (item as any).size}
                        </p>
                      )}
                      <p className="text-[10px] text-slate-400">1-Year Frame Warranty Included</p>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-900">{item.quantity}</td>
                    <td className="py-3 px-3 text-right text-slate-700">{formatPrice(item.price)}</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900">
                      {formatPrice(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Totals */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pt-4 border-t border-slate-200">
            <div className="text-xs text-slate-500 max-w-sm flex flex-col gap-1">
              <p className="font-bold text-slate-700">Terms & Conditions:</p>
              <p>• Prices are inclusive of all applicable Taxes & GST.</p>
              <p>• 1-Year Frame Warranty valid against manufacturing defects.</p>
              <p>• Free doorstep delivery on all orders.</p>
            </div>

            <div className="w-full sm:w-72 flex flex-col gap-1.5 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">{formatPrice(order.pricing.subtotal)}</span>
              </div>
              {order.pricing.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Coupon Discount ({((order as any).couponCode || (order as any).coupon?.code || 'PROMO')})</span>
                  <span>-{formatPrice(order.pricing.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Doorstep Delivery</span>
                <span className="text-emerald-700 font-bold">
                  {order.pricing.shipping === 0 ? 'FREE' : formatPrice(order.pricing.shipping)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>GST Charges</span>
                <span className="font-semibold text-emerald-700">Included in Price</span>
              </div>
              <div className="flex justify-between text-[11px] text-amber-800 font-bold">
                <span>Estimated Delivery Timeframe</span>
                <span>5 Working Days</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-black text-slate-900">
                <span>Grand Total</span>
                <span className="text-brand-700">{formatPrice(order.pricing.total)}</span>
              </div>
            </div>
          </div>

          {/* Authorised Signature & Stamp */}
          <div className="flex items-end justify-between pt-8 border-t border-slate-200 mt-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Verified Computer Generated Tax Invoice</span>
            </div>
            <div className="text-right text-xs">
              <div className="h-10 border-b border-slate-400 w-44 mb-1"></div>
              <p className="font-bold text-slate-900">For SRI RAMA CYCLE & AUTO SPARE PARTS</p>
              <p className="text-[10px] text-slate-500">Authorised Signatory</p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer Actions (Hidden during browser print) */}
        <div className="print:hidden p-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/70 transition-colors cursor-pointer"
          >
            Close Window
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice</span>
          </button>
        </div>
      </div>
    </div>
  );
}
