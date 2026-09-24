'use client';

import React, { useState, useRef } from 'react';
import {
  Printer,
  X,
  Send,
  CheckCircle2,
  Bike,
  FileText,
  Copy,
  Receipt,
  Download,
  Building2,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
import { formatPrice, formatDateTime, formatDate } from '@/lib/utils';
import { STORE_CONTACT, APP_NAME } from '@/lib/constants';
import { useToast } from '@/context/ToastContext';

interface IPOSReceiptModalProps {
  receiptData: any;
  onClose: () => void;
  onNewSale: () => void;
}

export default function POSReceiptModal({
  receiptData,
  onClose,
  onNewSale,
}: IPOSReceiptModalProps) {
  const [printFormat, setPrintFormat] = useState<'thermal' | 'a4'>('thermal');
  const receiptRef = useRef<HTMLDivElement>(null);
  const { success } = useToast();

  if (!receiptData) return null;

  const {
    invoiceNumber,
    orderNumber,
    date,
    cashier,
    customer,
    items,
    pricing,
    posDetails,
  } = receiptData;

  const cleanPhone = customer?.phone ? customer.phone.replace(/[^0-9]/g, '') : '';
  const waNumber = cleanPhone.startsWith('91')
    ? cleanPhone
    : cleanPhone.length === 10
      ? `91${cleanPhone}`
      : cleanPhone;

  // Format WhatsApp message
  const itemsText = (items || [])
    .map((item: any, i: number) => `${i + 1}. ${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}`)
    .join('\n');

  const waMessage = encodeURIComponent(
    `*SRI RAMA CYCLE & AUTO SPARE PARTS*\n` +
    `*In-Store Cash Bill / Tax Receipt*\n` +
    `================================\n` +
    `Invoice: *${invoiceNumber}*\n` +
    `Date: ${new Date(date).toLocaleDateString('en-IN')} ${new Date(date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}\n` +
    `Customer: *${customer?.name || 'Valued Customer'}*\n` +
    (customer?.phone && customer.phone !== 'Counter Sale' ? `Mobile: ${customer.phone}\n` : '') +
    `================================\n` +
    `*Purchased Items:*\n${itemsText}\n` +
    `================================\n` +
    `Subtotal: ₹${pricing.subtotal}\n` +
    (pricing.discount > 0 ? `Discount: -₹${pricing.discount}\n` : '') +
    (pricing.tax > 0 ? `GST / Tax: ₹${pricing.tax}\n` : '') +
    `*TOTAL PAID: ₹${pricing.total}* (${posDetails?.paymentMode || 'Cash'})\n` +
    `================================\n` +
    `Prop. ${STORE_CONTACT.proprietor}\n` +
    `📍 ${STORE_CONTACT.address}\n` +
    `📞 Phone & WhatsApp: ${STORE_CONTACT.phone}\n\n` +
    `Thank you for riding with Sri Rama Cycles!`
  );

  const waLink = waNumber ? `https://wa.me/${waNumber}?text=${waMessage}` : null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(decodeURIComponent(waMessage));
    success('Receipt bill summary copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden my-auto animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        {/* Modal Top Actions (Hidden in Print) */}
        <div className="no-print p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-600 flex items-center justify-center shadow-xs">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-black tracking-tight text-white flex items-center gap-2">
                <span>In-Store Bill Generated</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.2 rounded-full border border-emerald-500/30">
                  PAID
                </span>
              </h3>
              <p className="text-[11px] text-brand-300 font-mono mt-0.5">{invoiceNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Format toggle */}
            <div className="bg-slate-800 p-1 rounded-xl flex items-center gap-1 text-xs border border-slate-700">
              <button
                onClick={() => setPrintFormat('thermal')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  printFormat === 'thermal' ? 'bg-brand-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Thermal (80mm)</span>
              </button>
              <button
                onClick={() => setPrintFormat('a4')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  printFormat === 'a4' ? 'bg-brand-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Full GST Invoice</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Buttons Bar (Hidden in Print) */}
        <div className="no-print p-3 sm:p-4 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print {printFormat === 'thermal' ? 'Receipt Slip' : 'GST Invoice'}</span>
            </button>

            {waLink && (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send WhatsApp Bill</span>
              </a>
            )}

            <button
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 text-xs font-bold transition-colors"
              title="Copy bill text"
            >
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy Bill</span>
            </button>
          </div>

          <button
            onClick={onNewSale}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-colors shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4 text-slate-950" />
            <span>Next Customer Sale &rarr;</span>
          </button>
        </div>

        {/* Receipt Display Area */}
        <div className="p-4 sm:p-8 overflow-y-auto bg-slate-950/40 flex justify-center items-start min-h-[350px]">
          {/* 1. THERMAL 80mm FORMAT */}
          {printFormat === 'thermal' ? (
            <div
              ref={receiptRef}
              id="printable-receipt"
              className="w-[360px] bg-white text-slate-950 p-6 shadow-2xl rounded-2xl border border-slate-300 font-mono text-xs leading-relaxed transition-all"
            >
              {/* Header */}
              <div className="text-center pb-3 border-b-2 border-dashed border-slate-400">
                <h2 className="text-sm font-black uppercase tracking-tight text-slate-950">
                  {STORE_CONTACT.businessName}
                </h2>
                <p className="text-[11px] text-slate-700 font-bold uppercase mt-0.5">
                  Prop. {STORE_CONTACT.proprietor}
                </p>
                <p className="text-[10px] text-slate-600 mt-1 max-w-[280px] mx-auto leading-tight">
                  {STORE_CONTACT.address}
                </p>
                <p className="text-[11px] text-slate-900 font-bold mt-1">
                  📞 {STORE_CONTACT.phone}
                </p>
              </div>

              {/* Bill Meta */}
              <div className="py-2.5 border-b-2 border-dashed border-slate-400 flex flex-col gap-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">INVOICE:</span>
                  <span className="font-bold text-slate-950">{invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">DATE:</span>
                  <span className="text-slate-900">{formatDateTime(date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">CUSTOMER:</span>
                  <span className="font-bold text-slate-950">{customer?.name || 'Walk-in Customer'}</span>
                </div>
                {customer?.phone && customer.phone !== 'Counter Sale' && (
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">PHONE:</span>
                    <span className="text-slate-900">{customer.phone}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">PAYMENT:</span>
                  <span className="font-black bg-slate-100 px-1 rounded text-slate-950">
                    {posDetails?.paymentMode || 'Cash'} (PAID)
                  </span>
                </div>
              </div>

              {/* Line Items */}
              <div className="py-2.5 border-b-2 border-dashed border-slate-400">
                <div className="flex justify-between font-bold text-slate-950 border-b border-slate-300 pb-1 mb-2 text-[11px]">
                  <span>ITEM / QTY</span>
                  <span className="text-right">TOTAL</span>
                </div>

                <div className="flex flex-col gap-2.5">
                  {(items || []).map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-start gap-2 text-[11px]">
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-slate-950 leading-tight">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {item.quantity} x {formatPrice(item.price)}
                        </span>
                      </div>
                      <span className="font-black text-slate-950 shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Totals */}
              <div className="py-2.5 border-b-2 border-dashed border-slate-400 flex flex-col gap-1.5 text-[11px]">
                <div className="flex justify-between text-slate-600">
                  <span>SUBTOTAL:</span>
                  <span className="font-bold">{formatPrice(pricing.subtotal)}</span>
                </div>

                {pricing.discount > 0 && (
                  <div className="flex justify-between text-slate-900 font-bold">
                    <span>DISCOUNT:</span>
                    <span>-{formatPrice(pricing.discount)}</span>
                  </div>
                )}

                {pricing.tax > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>GST (INCLUDED):</span>
                    <span>{formatPrice(pricing.tax)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-black text-slate-950 pt-2 border-t-2 border-slate-900">
                  <span>NET PAID:</span>
                  <span>{formatPrice(pricing.total)}</span>
                </div>

                {posDetails?.paymentMode === 'Cash' && posDetails?.cashReceived > 0 && (
                  <div className="flex justify-between text-[10px] text-slate-500 pt-1">
                    <span>Cash Recd: {formatPrice(posDetails.cashReceived)}</span>
                    <span>Change: {formatPrice(posDetails.changeReturned || 0)}</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="pt-3 text-center flex flex-col gap-1 text-[10px] text-slate-600">
                <p className="font-bold text-slate-950">*** THANK YOU FOR YOUR BUSINESS! ***</p>
                <p>Goods once sold can be exchanged within 7 days with this bill.</p>
                <p className="text-[9px] text-slate-400 mt-1">Computer Generated POS Receipt</p>
              </div>
            </div>
          ) : (
            /* 2. FULL A4 / GST TAX INVOICE FORMAT */
            <div
              ref={receiptRef}
              id="printable-receipt"
              className="w-full max-w-2xl bg-white text-slate-950 p-8 shadow-2xl rounded-2xl border border-slate-300 font-sans text-xs leading-relaxed"
            >
              {/* Header Letterhead */}
              <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5 mb-5">
                <div>
                  <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                    {STORE_CONTACT.businessName}
                  </h1>
                  <p className="text-xs text-brand-700 font-bold uppercase mt-0.5">
                    Proprietor: {STORE_CONTACT.proprietor}
                  </p>
                  <p className="text-xs text-slate-600 mt-1 max-w-sm">
                    {STORE_CONTACT.address}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-slate-700 font-medium mt-1.5">
                    <span>📞 {STORE_CONTACT.phone}</span>
                    <span>✉️ {STORE_CONTACT.supportEmail}</span>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end">
                  <span className="text-base font-black uppercase text-slate-900 tracking-wider bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                    TAX INVOICE
                  </span>
                  <div className="mt-2 text-right">
                    <span className="text-[11px] text-slate-500 block">Invoice Number:</span>
                    <strong className="text-xs font-mono font-black text-slate-900">
                      {invoiceNumber}
                    </strong>
                    <span className="text-[11px] text-slate-500 block mt-1">Invoice Date:</span>
                    <strong className="text-xs text-slate-900">{formatDate(date)}</strong>
                  </div>
                </div>
              </div>

              {/* Billed To / Buyer Info */}
              <div className="grid grid-cols-2 gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200 mb-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Billed To (Customer):
                  </span>
                  <strong className="text-sm font-black text-slate-900 block">
                    {customer?.name || 'Walk-in Customer'}
                  </strong>
                  <span className="text-xs text-slate-600 block mt-0.5">
                    Phone: {customer?.phone || 'In-Store Counter'}
                  </span>
                  {customer?.email && !customer.email.includes('@pos.') && (
                    <span className="text-xs text-slate-600 block">Email: {customer.email}</span>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Payment & Store Counter:
                  </span>
                  <strong className="text-xs font-bold text-slate-900 block">
                    Payment Mode: {posDetails?.paymentMode || 'Cash'}
                  </strong>
                  <span className="text-xs font-bold text-emerald-700 block mt-0.5">
                    Status: PAID IN FULL
                  </span>
                  <span className="text-xs text-slate-500 block mt-0.5">
                    Cashier / Counter: {posDetails?.cashierName || 'Store Counter'}
                  </span>
                </div>
              </div>

              {/* Itemized Table */}
              <table className="w-full text-left text-xs mb-6 border border-slate-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-slate-900 text-white font-bold uppercase">
                    <th className="py-2.5 px-3 w-12 text-center">#</th>
                    <th className="py-2.5 px-3">Item Description</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit Rate</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {(items || []).map((item: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 text-center font-bold text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-3">
                        <strong className="text-slate-900 block">{item.name}</strong>
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-800">
                        {item.quantity}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-700 font-mono">
                        {formatPrice(item.price)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-black text-slate-900 font-mono">
                        {formatPrice(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pricing Breakdown */}
              <div className="flex justify-end mb-8">
                <div className="w-72 flex flex-col gap-1.5 text-xs">
                  <div className="flex justify-between text-slate-600 py-1">
                    <span>Subtotal:</span>
                    <span className="font-bold text-slate-900 font-mono">
                      {formatPrice(pricing.subtotal)}
                    </span>
                  </div>

                  {pricing.discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold py-1">
                      <span>Counter Discount:</span>
                      <span className="font-mono">-{formatPrice(pricing.discount)}</span>
                    </div>
                  )}

                  {pricing.tax > 0 && (
                    <div className="flex justify-between text-slate-600 py-1">
                      <span>GST / Tax (Included):</span>
                      <span className="font-mono">{formatPrice(pricing.tax)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t-2 border-slate-900">
                    <span>TOTAL PAYABLE:</span>
                    <span className="text-brand-700 font-mono">{formatPrice(pricing.total)}</span>
                  </div>
                </div>
              </div>

              {/* Signatures & Terms */}
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-200 text-[11px] text-slate-500">
                <div>
                  <strong className="text-slate-800 block mb-1">Terms & Conditions:</strong>
                  <p>1. Goods once sold can be exchanged within 7 days with this original invoice.</p>
                  <p>2. Warranty claims are subject to manufacturer terms.</p>
                </div>
                <div className="text-right flex flex-col justify-end items-end">
                  <div className="w-44 border-b border-slate-400 pb-8 text-center text-slate-400 text-[10px]">
                    Authorized Signatory
                  </div>
                  <strong className="text-slate-800 block mt-1 text-xs">
                    Sri Rama Cycle & Auto Spare Parts
                  </strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global CSS for Print Mode */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-receipt,
          #printable-receipt * {
            visibility: visible;
          }
          #printable-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            margin: 0 !important;
            padding: 15px !important;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
