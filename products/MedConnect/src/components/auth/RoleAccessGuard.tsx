import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Permission, UserRole } from '../../types';
import { ShieldAlert, Lock, ArrowRight, UserCheck } from 'lucide-react';

interface RoleAccessGuardProps {
  requiredPermission?: Permission;
  allowedRoles?: UserRole[];
  children: React.ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

export const RoleAccessGuard: React.FC<RoleAccessGuardProps> = ({
  requiredPermission,
  allowedRoles,
  children,
  fallbackTitle = 'Access Restricted by Row-Level Security (RLS)',
  fallbackMessage
}) => {
  const { currentUser, hasPermission, setIsAuthModalOpen } = useAuth();

  let hasAccess = true;

  if (requiredPermission && !hasPermission(requiredPermission)) {
    hasAccess = false;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    hasAccess = false;
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-2xl backdrop-blur-xl my-8 space-y-5 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-rose-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center mx-auto shadow-lg shadow-amber-950/40">
        <ShieldAlert className="w-8 h-8 text-amber-400" />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">{fallbackTitle}</h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
          {fallbackMessage ||
            `Your current logged-in role "${currentUser.role.toUpperCase()}" (${currentUser.name}) is not authorized to access this clinical resource under UK GDPR Article 9(2)(h) and HIPAA Security Rule Minimum Necessary standard.`}
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left space-y-2 max-w-md mx-auto text-xs">
        <div className="flex justify-between text-slate-400 font-mono">
          <span>Active User:</span>
          <span className="text-white font-bold">{currentUser.name}</span>
        </div>
        <div className="flex justify-between text-slate-400 font-mono">
          <span>Active Role:</span>
          <span className="text-amber-400 font-bold uppercase">{currentUser.role}</span>
        </div>
        <div className="flex justify-between text-slate-400 font-mono">
          <span>Required Permission:</span>
          <span className="text-cyan-400 font-bold">{requiredPermission || allowedRoles?.join(', ')}</span>
        </div>
      </div>

      <div className="pt-2 flex justify-center gap-3">
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-nhs-blue to-teal-600 hover:from-nhs-brightblue hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-nhs-blue/20 transition-all hover:scale-[1.02]"
        >
          <UserCheck className="w-4 h-4" />
          <span>Switch to Authorized Role</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
