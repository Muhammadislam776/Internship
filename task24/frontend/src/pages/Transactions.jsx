import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fetchTransactions } from '../services/paymentApi';
import { Search, Filter, ArrowUpDown, Download, CheckCircle2, XCircle, Clock, Copy } from 'lucide-react';

export default function Transactions() {
  const { showToast } = useApp();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchTransactions(searchTerm, statusFilter);
      setTransactions(data);
      setLoading(false);
    }
    loadData();
  }, [searchTerm, statusFilter]);

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    showToast(`Transaction ID ${id} copied to clipboard`, 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            Payment Audit Log
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-2 font-heading">
            Transaction History
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm">
            Search, filter, and inspect verified Stripe checkout session records.
          </p>
        </div>

        <button 
          onClick={() => showToast('Exporting CSV transaction summary...', 'success')}
          className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center space-x-2 shadow-xs transition-all"
        >
          <Download className="w-4 h-4 text-blue-600" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search transaction ID, plan, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {['All', 'Paid', 'Cancelled', 'Pending'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === status
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 animate-pulse font-medium">
            Loading transaction records...
          </div>
        ) : transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Transaction ID</th>
                  <th className="py-4 px-4">Product Plan</th>
                  <th className="py-4 px-4">Amount</th>
                  <th className="py-4 px-4">Customer Email</th>
                  <th className="py-4 px-4">Payment Method</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Date</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-slate-900">
                      <span className="flex items-center space-x-1.5">
                        <span>{tx.id}</span>
                        <button 
                          onClick={() => handleCopy(tx.id)}
                          className="text-slate-400 hover:text-blue-600"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </span>
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-800">{tx.productName}</td>
                    <td className="py-4 px-4 font-extrabold text-blue-600">${tx.amount}.00 USD</td>
                    <td className="py-4 px-4 text-slate-600">{tx.customerEmail}</td>
                    <td className="py-4 px-4 text-slate-500">{tx.paymentMethod || 'Stripe Card'}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        tx.status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : tx.status === 'Cancelled'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {tx.status === 'Paid' && <CheckCircle2 className="w-3 h-3" />}
                        {tx.status === 'Cancelled' && <XCircle className="w-3 h-3" />}
                        {tx.status === 'Pending' && <Clock className="w-3 h-3" />}
                        <span>{tx.status}</span>
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-500">
                      {new Date(tx.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => showToast(`Receipt #${tx.id} generated`, 'success')}
                        className="text-xs font-bold text-blue-600 hover:underline"
                      >
                        View Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <p className="font-bold text-slate-700">No transactions match your search criteria.</p>
            <p className="text-xs">Try clearing filters or search terms.</p>
          </div>
        )}
      </div>

    </div>
  );
}
