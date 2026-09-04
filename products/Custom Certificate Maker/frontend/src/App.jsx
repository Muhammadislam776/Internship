import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { PublicLayout } from './layouts/PublicLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { OrgLayout } from './layouts/OrgLayout';
import { RecipientLayout } from './layouts/RecipientLayout';

// Public Pages
import { LandingPage } from './pages/landing/LandingPage';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { VerifyPage } from './pages/public/VerifyPage';
import { NotFoundPage } from './pages/public/NotFoundPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageOrgs } from './pages/admin/ManageOrgs';
import { ManageRecipients } from './pages/admin/ManageRecipients';
import { ManageCertificates } from './pages/admin/ManageCertificates';
import { ManageTemplates } from './pages/admin/ManageTemplates';
import { VerificationLogs } from './pages/admin/VerificationLogs';
import { ActivityLogs } from './pages/admin/ActivityLogs';
import { ReportsPage } from './pages/admin/ReportsPage';
import { AdminNotificationsPage } from './pages/admin/AdminNotificationsPage';
import { AdminProfilePage } from './pages/admin/AdminProfilePage';
import { SystemSettings } from './pages/admin/SystemSettings';

// Org Pages
import { OrgDashboard } from './pages/org/OrgDashboard';
import { CertDesignerPage } from './pages/org/CertDesignerPage';
import { OrgTemplatesPage } from './pages/org/OrgTemplatesPage';
import { IssuedCertsPage } from './pages/org/IssuedCertsPage';
import { DraftCertsPage } from './pages/org/DraftCertsPage';
import { RecipientsPage } from './pages/org/RecipientsPage';
import { OrgVerificationPage } from './pages/org/OrgVerificationPage';
import { OrgAnalyticsPage } from './pages/org/OrgAnalyticsPage';
import { OrgProfilePage } from './pages/org/OrgProfilePage';
import { SignaturesBrandingPage } from './pages/org/SignaturesBrandingPage';

// Recipient Pages
import { RecipientDashboard } from './pages/recipient/RecipientDashboard';
import { MyCertificatesPage } from './pages/recipient/MyCertificatesPage';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Open Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify" element={<VerifyPage />} />
            <Route path="/verify/:certificateId" element={<VerifyPage />} />
          </Route>

          {/* Super Admin Protected Routes (Role: admin) */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="organizations" element={<ManageOrgs />} />
              <Route path="orgs" element={<ManageOrgs />} />
              <Route path="recipients" element={<ManageRecipients />} />
              <Route path="users" element={<ManageRecipients />} />
              <Route path="certificates" element={<ManageCertificates />} />
              <Route path="templates" element={<ManageTemplates />} />
              <Route path="verification" element={<VerificationLogs />} />
              <Route path="logs" element={<VerificationLogs />} />
              <Route path="activity-logs" element={<ActivityLogs />} />
              <Route path="notifications" element={<AdminNotificationsPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="settings" element={<SystemSettings />} />
              <Route path="profile" element={<AdminProfilePage />} />
            </Route>
          </Route>

          {/* Organization / Issuer Protected Routes (Roles: organization, admin) */}
          <Route element={<ProtectedRoute allowedRoles={['organization', 'admin']} />}>
            <Route path="/org" element={<OrgLayout />}>
              <Route index element={<OrgDashboard />} />
              <Route path="designer" element={<CertDesignerPage />} />
              <Route path="templates" element={<OrgTemplatesPage />} />
              <Route path="issued" element={<IssuedCertsPage />} />
              <Route path="drafts" element={<DraftCertsPage />} />
              <Route path="recipients" element={<RecipientsPage />} />
              <Route path="verification" element={<OrgVerificationPage />} />
              <Route path="analytics" element={<OrgAnalyticsPage />} />
              <Route path="profile" element={<OrgProfilePage />} />
              <Route path="branding" element={<SignaturesBrandingPage />} />
              <Route path="settings" element={<OrgProfilePage />} />
            </Route>
          </Route>

          {/* Recipient / Student Protected Routes (Roles: recipient, admin) */}
          <Route element={<ProtectedRoute allowedRoles={['recipient', 'admin']} />}>
            <Route path="/recipient" element={<RecipientLayout />}>
              <Route index element={<RecipientDashboard />} />
              <Route path="certificates" element={<MyCertificatesPage />} />
              <Route path="profile" element={<RecipientDashboard />} />
            </Route>
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
