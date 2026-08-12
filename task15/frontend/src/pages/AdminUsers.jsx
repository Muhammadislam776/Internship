import React, { useState, useRef } from 'react';
import { 
  Users, 
  RefreshCw, 
  Plus, 
  Download, 
  AlertTriangle, 
  SearchX, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  ShieldCheck,
  Server
} from 'lucide-react';
import { HeroSection } from '../components/HeroSection';
import { StatsCards } from '../components/StatsCards';
import { SearchBar } from '../components/SearchBar';
import { FilterBar } from '../components/FilterBar';
import { UserTable } from '../components/UserTable';
import { UserCard } from '../components/UserCard';
import { SkeletonTable } from '../components/SkeletonTable';
import { UserProfileModal } from '../components/UserProfileModal';
import { PlayCard } from '../components/PlayCard';
import { ImageHoverCards } from '../components/ImageHoverCards';
import { Analytics } from '../components/Analytics';
import { ActivityTimeline } from '../components/ActivityTimeline';
import { ApiStatus } from '../components/ApiStatus';
import { ExportCard } from '../components/ExportCard';
import { AddUserModal } from '../components/AddUserModal';

export const AdminUsers = ({ 
  userHook, 
  onShowToast 
}) => {
  const {
    users,
    loading,
    error,
    dataSource,
    apiHealth,
    pagination,
    stats,
    page,
    perPage,
    search,
    role,
    status,
    sortBy,
    setPage,
    setPerPage,
    setSearch,
    setRole,
    setStatus,
    setSortBy,
    refetch
  } = userHook;

  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const searchInputRef = useRef(null);

  const handleDeleteUser = (user) => {
    onShowToast && onShowToast({
      title: 'User Revoked',
      message: `User ${user.full_name} (${user.email}) revoked from Supabase Auth`,
      type: 'warning'
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* HERO SECTION */}
      <HeroSection 
        onRefresh={() => {
          refetch();
          onShowToast && onShowToast({ title: 'Users Refreshed', message: 'Requested latest user dataset from Express server', type: 'info' });
        }}
        onAddUser={() => setShowAddUserModal(true)}
        loading={loading}
        totalUsersCount={pagination.totalUsers}
      />

      {/* STATS CARDS WITH 3D FLIP CARDS */}
      <StatsCards stats={stats} loading={loading} />

      {/* API STATUS LIVE CARD */}
      <ApiStatus apiHealth={apiHealth} dataSource={dataSource} />

      {/* EXPORT DATA CARD */}
      <ExportCard users={users} onShowToast={onShowToast} />

      {/* SEARCH AND FILTER CONTROLS */}
      <div className="space-y-4">
        <SearchBar 
          search={search} 
          onSearchChange={setSearch} 
          inputRef={searchInputRef} 
        />
        <FilterBar 
          role={role}
          onRoleChange={setRole}
          status={status}
          onStatusChange={setStatus}
          sortBy={sortBy}
          onSortChange={setSortBy}
          perPage={perPage}
          onPerPageChange={setPerPage}
          totalResults={pagination.totalUsers}
        />
      </div>

      {/* MAIN USERS CONTENT AREA */}
      <div>
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-[#22D3EE]" /> User Management Table
            </h2>
            <p className="text-xs text-[#9FB0C2] mt-0.5">Manage registered platform users securely via server-side Express API.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddUserModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF7A18] to-[#FFB86B] font-bold text-xs text-white shadow-md shadow-[#FF7A18]/30 hover:scale-105 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add User</span>
            </button>
          </div>
        </div>

        {/* LOADING STATE (Skeleton Rows) */}
        {loading && <SkeletonTable rows={perPage > 10 ? 10 : perPage} />}

        {/* ERROR STATE */}
        {!loading && error && (
          <div className="glass-panel rounded-3xl p-8 border border-red-500/40 text-center space-y-4 shadow-2xl my-6">
            <div className="w-14 h-14 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto border border-red-500/30">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Unable to load users</h3>
              <p className="text-xs text-[#9FB0C2] mt-1 max-w-md mx-auto">{error}</p>
            </div>
            <button
              onClick={refetch}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#22D3EE] font-bold text-xs text-white shadow-lg shadow-[#2563EB]/40 hover:scale-105 transition-all"
            >
              <RefreshCw className="w-4 h-4" /> Retry Connection
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && users.length === 0 && (
          <div className="glass-panel rounded-3xl p-12 border border-white/10 text-center space-y-4 shadow-xl my-6">
            <div className="w-16 h-16 rounded-full bg-white/5 text-[#22D3EE] flex items-center justify-center mx-auto border border-[#22D3EE]/20">
              <SearchX className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">No users found</h3>
              <p className="text-xs text-[#9FB0C2] mt-1">Try changing your search keywords or clearing active filters.</p>
            </div>
            <button
              onClick={() => {
                setSearch('');
                setRole('all');
                setStatus('all');
              }}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/20 transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* TABLE VIEW (Desktop) */}
        {!loading && !error && users.length > 0 && (
          <>
            <div className="hidden lg:block">
              <UserTable 
                users={users}
                onSelectUser={(u) => setSelectedUser(u)}
                onDeleteUser={handleDeleteUser}
                onShowToast={onShowToast}
              />
            </div>

            {/* CARD VIEW (Tablet/Mobile) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
              {users.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onSelectUser={(u) => setSelectedUser(u)}
                  onDeleteUser={handleDeleteUser}
                  onShowToast={onShowToast}
                />
              ))}
            </div>

            {/* PAGINATION CONTROLS */}
            <div className="glass-panel rounded-2xl p-4 border border-white/10 shadow-lg mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="text-[#9FB0C2] font-mono">
                Showing <strong className="text-white">{pagination.showingFrom}</strong> – <strong className="text-white">{pagination.showingTo}</strong> of <strong className="text-[#22D3EE]">{pagination.totalUsers}</strong> registered users
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl glass-card text-white hover:text-[#22D3EE] border border-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>

                {/* Page Number Buttons */}
                <div className="flex items-center gap-1 font-mono">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    const isActive = pageNum === page;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-8 h-8 rounded-xl font-bold transition-all ${
                          isActive 
                            ? 'bg-[#2563EB] text-white shadow-md shadow-[#2563EB]/40 border border-[#22D3EE]' 
                            : 'glass-card text-[#9FB0C2] hover:text-white'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage(page + 1)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl glass-card text-white hover:text-[#22D3EE] border border-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* PLAY CARD / LIFECYCLE REPLAY */}
      <PlayCard />

      {/* IMAGE HOVER CARDS - PLATFORM ACTIVITY */}
      <ImageHoverCards onShowToast={onShowToast} />

      {/* ANALYTICS SECTION */}
      <Analytics />

      {/* ACTIVITY AUDIT TIMELINE */}
      <ActivityTimeline />

      {/* USER PROFILE MODAL */}
      {selectedUser && (
        <UserProfileModal 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
        />
      )}

      {/* ADD USER MODAL */}
      {showAddUserModal && (
        <AddUserModal 
          onClose={() => setShowAddUserModal(false)}
          onSuccess={refetch}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
};
