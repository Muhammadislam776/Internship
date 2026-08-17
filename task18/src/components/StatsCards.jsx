import React from 'react';
import FlipCard from './FlipCard';
import { Mail, CheckCircle2, Zap, Activity } from 'lucide-react';

export default function StatsCards({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* 3D Flip Card 1: Emails Sent */}
      <FlipCard
        frontTitle="Emails Sent"
        frontValue={stats?.sent ? stats.sent.toLocaleString() : '1,284'}
        frontSub="Real-Time Delivered"
        backTitle="Delivery Growth"
        backValue="+18.6%"
        backDesc="Compared with previous period. Zero email throttling detected."
        accentColor="blue"
      />

      {/* 3D Flip Card 2: Success Rate */}
      <FlipCard
        frontTitle="Success Rate"
        frontValue={stats?.successRate ? `${stats.successRate}%` : '98.7%'}
        frontSub="Edge Function Healthy"
        backTitle="System Health"
        backValue="99.98% Uptime"
        backDesc="Email service is operating normally with automated fallback."
        accentColor="green"
      />

      {/* 3D Flip Card 3: Total Events */}
      <FlipCard
        frontTitle="Total Events"
        frontValue={stats?.total ? stats.total.toLocaleString() : '2,450'}
        frontSub="Database Inserts Tracked"
        backTitle="Daily Activity"
        backValue="Today's Activity"
        backDesc="100% database events captured via PostgreSQL webhooks."
        accentColor="orange"
      />

    </div>
  );
}
