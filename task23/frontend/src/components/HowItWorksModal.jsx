import React, { useState } from 'react';
import { X, Database, Search, ArrowRight, CheckCircle2, ShieldCheck, Code, Layers, Zap, Sparkles } from 'lucide-react';

export default function HowItWorksModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('architecture');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-slide-up">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0F172A] border border-slate-800 rounded-3xl shadow-2xl overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 py-5 bg-[#0F172A]/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Architecture & SQL Intelligence</h2>
              <p className="text-xs text-slate-400">Educational guide on Relational SQL JOINs & Database Full-Text Search</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="px-6 pt-4 flex gap-2 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-4 py-2 rounded-t-xl font-semibold text-xs transition-all ${
              activeTab === 'architecture'
                ? 'bg-indigo-600 text-white border-t border-x border-indigo-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            Relational JOIN Flow
          </button>

          <button
            onClick={() => setActiveTab('fts')}
            className={`px-4 py-2 rounded-t-xl font-semibold text-xs transition-all ${
              activeTab === 'fts'
                ? 'bg-indigo-600 text-white border-t border-x border-indigo-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            Database Full-Text Search
          </button>

          <button
            onClick={() => setActiveTab('sql')}
            className={`px-4 py-2 rounded-t-xl font-semibold text-xs transition-all ${
              activeTab === 'sql'
                ? 'bg-indigo-600 text-white border-t border-x border-indigo-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            SQL Query Inspector
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 space-y-6">
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              {/* Flowchart visual */}
              <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800 text-center">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-6 flex items-center justify-center gap-2">
                  <Layers className="w-4 h-4" />
                  <span>Relational SQL JOIN Architecture</span>
                </h4>

                <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 w-44 text-left">
                    <span className="font-bold text-white block mb-1">Customers Table</span>
                    <span className="font-mono text-cyan-400 block text-[11px]">id (Primary Key)</span>
                    <span className="text-slate-400 block text-[10px]">name, email, avatar, city</span>
                  </div>

                  <ArrowRight className="w-5 h-5 text-indigo-400 rotate-90 md:rotate-0" />

                  <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 w-44 text-left">
                    <span className="font-bold text-white block mb-1">Orders Table</span>
                    <span className="font-mono text-indigo-400 block text-[11px]">customer_id (FK)</span>
                    <span className="text-slate-400 block text-[10px]">order_num, product, amount</span>
                  </div>

                  <ArrowRight className="w-5 h-5 text-indigo-400 rotate-90 md:rotate-0" />

                  <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-900 to-purple-900 border border-indigo-500/40 w-48 text-left">
                    <span className="font-bold text-white block mb-1">SQL JOIN Query</span>
                    <span className="font-mono text-emerald-300 block text-[11px]">Single Combined Result</span>
                    <span className="text-slate-300 block text-[10px]">Order + Related Customer</span>
                  </div>
                </div>
              </div>

              {/* Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Why Relational SQL JOIN?</span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                    <li><strong>Data Integrity:</strong> Customer info exists in exactly one place (<code className="text-cyan-300">customers</code> table).</li>
                    <li><strong>No Redundancy:</strong> Customer email/address changes update instantly across all past and future orders.</li>
                    <li><strong>Normalized Storage:</strong> Avoids duplicating name, phone, avatar in 1,600+ order rows.</li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                    <X className="w-4 h-4" />
                    <span>Drawback of Data Duplication</span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                    <li><strong>Inconsistent Records:</strong> Updating email requires updating thousands of individual order rows.</li>
                    <li><strong>Bloated Database Size:</strong> Storing customer avatars and addresses in every order multiplies storage by 10x.</li>
                    <li><strong>Loss of Customer Identity:</strong> Difficult to compute aggregated customer lifetime spending.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fts' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                  <Zap className="w-4 h-4" />
                  <span>Database Full-Text Search vs Client-Side Filtering</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  In OrderSphere, global search executes **at the database engine layer** using indexed Full-Text Search (<code className="text-indigo-300 font-mono">orders_fts MATCH</code> / PostgreSQL <code className="text-indigo-300 font-mono">to_tsvector</code> GIN index).
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
                    <span className="font-bold text-cyan-400 block mb-1">Database FTS (OrderSphere approach)</span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Indexes terms across joined customer and order tables. Scales effortlessly to <strong>1,000,000+ orders</strong> with sub-5ms query response times and minimal network payload.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
                    <span className="font-bold text-rose-400 block mb-1">Client-side JS Array .filter()</span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Requires transferring the entire 500MB database over HTTP into browser memory before filtering. Crashes mobile browsers and causes severe lag on large datasets.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
                <span className="flex items-center gap-2 text-indigo-400 font-sans font-bold">
                  <Code className="w-4 h-4" />
                  <span>Actual SQL Executed on Backend</span>
                </span>
                <span className="text-[10px] text-slate-500">PostgreSQL / SQLite</span>
              </div>

              <pre className="p-4 rounded-xl bg-[#090D16] text-indigo-200 overflow-x-auto leading-relaxed border border-indigo-900/50">
{`SELECT 
  o.id,
  o.order_number,
  o.product_name,
  o.product_image,
  o.category,
  o.amount,
  o.status,
  o.payment_status,
  o.order_date,
  o.shipping_city,
  c.id AS customer_id,
  c.name AS customer_name,
  c.email AS customer_email,
  c.phone AS customer_phone,
  c.avatar AS customer_avatar,
  c.city AS customer_city,
  c.country AS customer_country,
  c.customer_type
FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE o.id IN (SELECT order_id FROM orders_fts WHERE orders_fts MATCH 'headphones*')
ORDER BY o.order_date DESC
LIMIT 10 OFFSET 0;`}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
