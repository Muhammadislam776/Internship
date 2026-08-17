import React from 'react';
import { Calendar, UserPlus, ShoppingBag, CreditCard, LifeBuoy, ArrowRight } from 'lucide-react';

export default function InteractiveImageCards({ onSelectType }) {
  const cards = [
    {
      title: 'New Booking Notification',
      category: 'Hospitality & Travel',
      icon: Calendar,
      img: '/assets/booking.jpg',
      preset: {
        name: 'Alexa Chen',
        email: 'alexa.chen@luminaresort.com',
        eventType: 'New Booking',
        subject: 'Booking Confirmation — Skyline Suite #402',
        message: 'Your room reservation for Oct 24-28, 2026 is confirmed. Total paid: $1,850.00 USD.'
      }
    },
    {
      title: 'New User Registration',
      category: 'SaaS Onboarding',
      icon: UserPlus,
      img: '/assets/user.jpg',
      preset: {
        name: 'Marcus Vance',
        email: 'marcus.vance@techcorp.io',
        eventType: 'New User',
        subject: 'Welcome to NotifyFlow Developer Portal',
        message: 'Your developer workspace is ready. Access your API keys in the Settings tab.'
      }
    },
    {
      title: 'Payment & Payout Confirmation',
      category: 'Fintech & Billing',
      icon: CreditCard,
      img: '/assets/payment.jpg',
      preset: {
        name: 'Elena Rostova',
        email: 'elena.rostova@cybernet.de',
        eventType: 'Payment',
        subject: 'Payout Processed — $1,450.00 USD',
        message: 'Your withdrawal to Deutsche Bank (****9876) has completed successfully.'
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-xl font-bold text-[#071A2B]">Realistic SaaS Notification Use Cases</h3>
          <p className="text-xs text-[#64748B]">Click any visual card to auto-fill event demo form</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              onClick={() => onSelectType && onSelectType(card.preset)}
              className="interactive-image-card cursor-pointer group"
            >
              <img src={card.img} alt={card.title} className="card-img" />
              
              <div className="overlay">
                <div className="flex items-center gap-2 mb-1">
                  <span className="p-1.5 rounded-lg bg-[#2563EB]/80 text-[#22D3EE] backdrop-blur-md">
                    <Icon size={16} />
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#22D3EE] uppercase tracking-wider">
                    {card.category}
                  </span>
                </div>

                <h4 className="font-heading text-base font-bold text-white group-hover:text-[#22D3EE] transition-colors">
                  {card.title}
                </h4>

                <div className="mt-2 text-xs text-[#CBD5E1] flex items-center gap-1 font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Trigger Demo Event</span>
                  <ArrowRight size={14} className="text-[#FF7A18]" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
