import React from 'react';
import { Zap, Shield, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#071A2B] text-white border-t border-[#22D3EE]/15 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#22D3EE] flex items-center justify-center">
                <Zap size={20} className="text-white" />
              </div>
              <span className="font-heading text-xl font-bold text-white">
                Notify<span className="text-[#22D3EE]">Flow</span>
              </span>
            </div>
            <p className="text-sm text-[#94A3B8] max-w-sm leading-relaxed">
              Reliable event-driven notifications for modern applications. Monitor database inserts and trigger serverless emails instantly.
            </p>
            <div className="text-xs text-[#22D3EE] font-mono flex items-center gap-2">
              <Shield size={14} />
              <span>Server-Side Credential Protection Guaranteed</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-bold text-white uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-xs text-[#94A3B8]">
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link to="/events" className="hover:text-white transition-colors">Live Event Feed</Link></li>
              <li><Link to="/emails" className="hover:text-white transition-colors">Email Logs</Link></li>
              <li><Link to="/analytics" className="hover:text-white transition-colors">Analytics Engine</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-bold text-white uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2 text-xs text-[#94A3B8]">
              <li><Link to="/api-docs" className="hover:text-white transition-colors">API Documentation</Link></li>
              <li><Link to="/settings" className="hover:text-white transition-colors">Supabase Setup</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Security Overview</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#94A3B8] gap-4">
          <div>
            &copy; 2026 NotifyFlow Inc. All rights reserved. Every Event Deserves a Notification.
          </div>
          <div className="flex items-center gap-1">
            Built with <Heart size={13} className="text-[#FF7A18] fill-current" /> for Modern Full-Stack Developers.
          </div>
        </div>

      </div>
    </footer>
  );
}
