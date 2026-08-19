import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import MetricCard from '../components/MetricCard';
import InvoiceModal from '../components/InvoiceModal';
import { fetchAnalytics, fetchTransactions, issueTransactionRefund } from '../services/paymentApi';
import { 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  TrendingUp, 
  ShoppingBag, 
  ArrowRight,
  Sparkles,
  CreditCard,
  Printer,
  RotateCcw,
  Zap,
  Terminal
} from 'lucide-react';

export default function Dashboard() {
  const { setCurrentView, openCheckoutDrawer, products, showToast } = useApp();
  const [metrics, setMetrics] = useState({
    totalRevenue: '1,284.00',
    totalPurchasesCount: 21,
    successfulCount: 18,
    refundedCount: 0,
    pendingCount: 1,
    cancelledCount: 2,
    avgTransactionValue: '61.14',
    conversionRate: '85.7'
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  // Webhook event simulation log
  const [webhookLogs, setWebhookLogs] = useState([
    { id: 1, event: 'checkout.session.completed', time: '1 min ago', status: '200 OK', id_ref: 'cs_test_a1b2c3' },
    { id: 2, event: 'payment_intent.succeeded', time: '1 min ago', status: '200 OK', id_ref: 'pi_3MtwB2Lkd' },
    { id: 3, event: 'charge.succeeded', time: '1 min ago', status: '200 OK', id_ref: 'ch_3MtwB2Lkd' }
  ]);

  const loadData = async () => {
    setLoading(true);
    const analyticsData = await fetchAnalytics();
    if (analyticsData && analyticsData.metrics) {
      setMetrics(analyticsData.metrics);
    }
    const txData = await fetchTransactions();
    if (txData && txData.length > 0) {
      setRecentTransactions(txData.slice(0, 6));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefund = async (txId) => {
    if (!window.confirm(`Issue refund for transaction ${txId}?`)) return;
    const res = await issueTransactionRefund(txId);
    if (res.success) {
      showToast(res.message, 'success');
      loadData();
    } else {
      showToast(res.error || 'Refund failed', 'error');
    }
  };

  const triggerTestWebhook = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'checkout.session.completed',
          data: {
            object: {
              id: `cs_live_${Math.random().toString(36).substring(2, 10)}`,
              amount_total: 4900,
              currency: 'usd',
              customer_details: { email: 'webhook-user@stripe.com' },
              metadata: { productId: 'pro', productName: 'Pro Flow' }
            }
          }
        })
      });
      const data = await res.json();
      showToast('Stripe Webhook event triggered and processed!', 'success');
      setWebhookLogs(prev => [
        { id: Date.now(), event: 'checkout.session.completed', time: 'Just now', status: '200 OK', id_ref: 'cs_live_new' },
        ...prev
      ]);
      loadData();
    } catch (e) {
      showToast('Webhook trigger failed', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-orange-500 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold text-white border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-orange-300" />
            <span>Stripe Production Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-heading">
            Payment Intelligence & Audit
          </h1>
          <p className="text-blue-100 text-sm max-w-lg">
            Monitor live Stripe checkout sessions, issue refunds, download invoices, and inspect webhooks.
          </p>
        </div>

        <div className="flex items-center space-x-3 z-10">
          <button
            onClick={triggerTestWebhook}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-3 rounded-2xl text-xs flex items-center space-x-2 border border-slate-700 shadow-md transition-all"
          >
            <Zap className="w-4 h-4 text-orange-400" />
            <span>Trigger Stripe Webhook</span>
          </button>
          <button
            onClick={() => openCheckoutDrawer(products[1] || products[0])}
            className="bg-white hover:bg-slate-50 text-slate-900 font-bold px-5 py-3 rounded-2xl shadow-lg text-xs flex items-center space-x-2 transition-all hover:scale-105"
          >
            <CreditCard className="w-4 h-4 text-orange-500" />
            <span>New Test Checkout</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Gross Revenue"
          value={`$${metrics.totalRevenue}`}
          change="14.2%"
          isPositive={true}
          icon={DollarSign}
          color="blue"
        />
        <MetricCard
          title="Verified Payments"
          value={metrics.successfulCount}
          change="8.5%"
          isPositive={true}
          icon={CheckCircle2}
          color="emerald"
        />
        <MetricCard
          title="Refunded Volume"
          value={metrics.refundedCount || 0}
          change="0.0%"
          isPositive={true}
          icon={RotateCcw}
          color="amber"
        />
        <MetricCard
          title="Cancelled Checkout"
          value={metrics.cancelledCount}
          change="2.1%"
          isPositive={false}
          icon={XCircle}
          color="rose"
        />
      </div>

      {/* Webhook Stream & Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Chart */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-heading">
                Revenue Settlement Stream
              </h3>
              <p className="text-xs text-slate-500">
                Stripe processed payment distribution by month
              </p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Avg. Order: ${metrics.avgTransactionValue}
            </span>
          </div>

          <div className="h-60 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-100">
            {[
              { month: 'Jan', amount: 420, height: '40%' },
              { month: 'Feb', amount: 680, height: '55%' },
              { month: 'Mar', amount: 890, height: '70%' },
              { month: 'Apr', amount: 740, height: '60%' },
              { month: 'May', amount: 1100, height: '85%' },
              { month: 'Jun', amount: 1284, height: '100%' },
            ].map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <span className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  ${bar.amount}
                </span>
                <div 
                  style={{ height: bar.height }}
                  className="w-full max-w-[48px] rounded-2xl bg-gradient-to-t from-blue-600 to-orange-500 group-hover:from-blue-700 group-hover:to-orange-600 transition-all duration-300 shadow-md"
                />
                <span className="text-xs font-semibold text-slate-600">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Webhook Console Feed */}
        <div className="lg:col-span-5 bg-slate-950 text-white rounded-3xl p-6 shadow-xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Live Stripe Webhook Console</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            </div>

            <div className="mt-4 space-y-2.5 font-mono text-xs">
              {webhookLogs.map((log) => (
                <div key={log.id} className="bg-slate-900 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-emerald-400 font-bold block">{log.event}</span>
                    <span className="text-[10px] text-slate-500">{log.id_ref} • {log.time}</span>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={triggerTestWebhook}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md"
          >
            <Zap className="w-3.5 h-3.5 text-orange-400" />
            <span>Simulate Incoming Stripe Webhook</span>
          </button>
        </div>

      </div>

      {/* Transaction Table with Invoice & Refund Actions */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-heading">
              Recent Customer Transactions
            </h3>
            <p className="text-xs text-slate-500">
              Click invoice to print/download receipt or issue a refund
            </p>
          </div>

          <button
            onClick={() => setCurrentView('transactions')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 transition-colors"
          >
            <span>View Full History</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase">
                <th className="pb-3 px-2">Order ID</th>
                <th className="pb-3 px-2">Product</th>
                <th className="pb-3 px-2">Amount</th>
                <th className="pb-3 px-2">Customer Email</th>
                <th className="pb-3 px-2">Status</th>
                <th className="pb-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-2 font-mono font-bold text-slate-900">{tx.id}</td>
                  <td className="py-3.5 px-2 font-semibold text-slate-800">{tx.productName}</td>
                  <td className="py-3.5 px-2 font-bold text-blue-600">${tx.amount}.00 USD</td>
                  <td className="py-3.5 px-2 text-slate-600">{tx.customerEmail}</td>
                  <td className="py-3.5 px-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      tx.status === 'Paid'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : tx.status === 'Refunded'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      ● {tx.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-2 text-right space-x-2">
                    <button
                      onClick={() => setSelectedInvoice(tx)}
                      className="inline-flex items-center space-x-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors"
                    >
                      <Printer className="w-3 h-3 text-blue-600" />
                      <span>Invoice</span>
                    </button>

                    {tx.status === 'Paid' && (
                      <button
                        onClick={() => handleRefund(tx.id)}
                        className="inline-flex items-center space-x-1 bg-rose-50 hover:bg-rose-100 text-rose-700 px-2.5 py-1 rounded-lg font-bold text-[11px] border border-rose-200 transition-colors"
                      >
                        <RotateCcw className="w-3 h-3 text-rose-600" />
                        <span>Refund</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal */}
      {selectedInvoice && (
        <InvoiceModal
          transaction={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}

    </div>
  );
}
