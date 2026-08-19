import React from 'react';
import { X, Printer, Download, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

export default function InvoiceModal({ transaction, onClose }) {
  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 relative space-y-6">
        
        {/* Header bar */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg font-heading">
              💳
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-heading">Official Payment Invoice</h2>
              <p className="text-xs text-slate-500">Receipt ID: {transaction.id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center space-x-1 transition-colors"
            >
              <Printer className="w-4 h-4 text-blue-600" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-2 gap-6 text-xs border-b border-slate-100 pb-6">
          <div>
            <span className="text-slate-400 font-bold uppercase block mb-1">Merchant Info</span>
            <p className="font-bold text-slate-900">PayFlow Inc.</p>
            <p className="text-slate-600">548 Market St, Suite 400</p>
            <p className="text-slate-600">San Francisco, CA 94104</p>
            <p className="text-blue-600 font-medium mt-1">support@payflow.io</p>
          </div>
          <div className="text-right">
            <span className="text-slate-400 font-bold uppercase block mb-1">Customer Billed</span>
            <p className="font-bold text-slate-900">{transaction.customerEmail}</p>
            <p className="text-slate-600">Date: {new Date(transaction.date).toLocaleDateString()}</p>
            <p className="text-slate-600">Method: {transaction.paymentMethod || 'Stripe Card'}</p>
            <span className="inline-block mt-2 px-3 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
              ● {transaction.status}
            </span>
          </div>
        </div>

        {/* Line Item Table */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase">
                <th className="pb-2">Description</th>
                <th className="pb-2 text-center">Qty</th>
                <th className="pb-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-3 font-bold text-slate-900">{transaction.productName} Plan Subscription</td>
                <td className="py-3 text-center">1</td>
                <td className="py-3 text-right font-extrabold text-blue-600">${transaction.amount}.00 USD</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Total Summary */}
        <div className="flex justify-between items-center pt-2 text-sm font-bold">
          <span className="text-slate-700">Total Amount Paid</span>
          <span className="text-2xl font-black text-blue-600 font-heading">${transaction.amount}.00 USD</span>
        </div>

        {/* Footer Security Note */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center space-x-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>PCI-DSS Level 1 TLS Certified Receipt</span>
          </span>
          <span className="font-mono">Stripe Session: {transaction.sessionId ? transaction.sessionId.slice(0, 16) + '...' : 'cs_verified'}</span>
        </div>

      </div>
    </div>
  );
}
