import { supabase, isSupabaseConfigured } from './supabase';

const CURRENT_USER_KEY = 'sharevault_user';
const REGISTERED_USERS_KEY = 'sharevault_registered_users';

// Pre-seed demo user if empty so demo account works out of the box
function getRegisteredUsers() {
  const data = localStorage.getItem(REGISTERED_USERS_KEY);
  if (!data) {
    const defaultUsers = [
      {
        id: 'user_demo_101',
        email: 'demo@sharevault.com',
        password: 'password123',
        fullName: 'Demo Account',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function saveRegisteredUsers(users) {
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
}

export const authService = {
  // Get current active session
  getCurrentUser() {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse cached user', e);
      }
    }
    return null;
  },

  // 1. STRICT REGISTER: Checks if email already exists
  async register({ email, password, fullName }) {
    const cleanEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) throw new Error(error.message);

      const user = {
        id: data.user.id,
        email: data.user.email,
        fullName: fullName || data.user.user_metadata?.full_name || 'Vault User',
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName || cleanEmail)}`,
      };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return user;
    } else {
      const registeredUsers = getRegisteredUsers();
      
      // Check if user already exists
      const existingUser = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);
      if (existingUser) {
        throw new Error('An account with this email address already exists. Please log in.');
      }

      // Save new user to registry
      const newUser = {
        id: 'user_' + Date.now(),
        email: cleanEmail,
        password,
        fullName: fullName.trim() || cleanEmail.split('@')[0],
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName || cleanEmail)}`,
        createdAt: new Date().toISOString(),
      };

      registeredUsers.push(newUser);
      saveRegisteredUsers(registeredUsers);

      // Log in session
      const sessionUser = {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        avatarUrl: newUser.avatarUrl,
      };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
      return sessionUser;
    }
  },

  // 2. STRICT LOGIN: Verifies email exists in registry and password matches
  async login({ email, password, rememberMe = false }) {
    const cleanEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });
      if (error) throw new Error(error.message);

      const fullName = data.user.user_metadata?.full_name || cleanEmail.split('@')[0];
      const user = {
        id: data.user.id,
        email: data.user.email,
        fullName,
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`,
      };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return user;
    } else {
      const registeredUsers = getRegisteredUsers();
      
      // Check if user exists in database
      const userMatch = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);
      if (!userMatch) {
        throw new Error('No registered account found with this email. Please click "Register Free Account" first.');
      }

      // Check password
      if (userMatch.password !== password) {
        throw new Error('Incorrect password. Please check your credentials and try again.');
      }

      const sessionUser = {
        id: userMatch.id,
        email: userMatch.email,
        fullName: userMatch.fullName,
        avatarUrl: userMatch.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userMatch.fullName)}`,
      };

      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
      return sessionUser;
    }
  },

  // 3. OAuth Confirmation Authorization
  async confirmOAuthLogin(provider, email, fullName) {
    const cleanEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/dashboard` }
      });
      if (error) throw new Error(error.message);
    }

    const registeredUsers = getRegisteredUsers();
    let existingUser = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);

    if (!existingUser) {
      existingUser = {
        id: `user_${provider}_` + Date.now(),
        email: cleanEmail,
        password: 'oauth_authenticated',
        fullName: fullName || `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanEmail)}`,
        createdAt: new Date().toISOString(),
      };
      registeredUsers.push(existingUser);
      saveRegisteredUsers(registeredUsers);
    }

    const sessionUser = {
      id: existingUser.id,
      email: existingUser.email,
      fullName: existingUser.fullName,
      avatarUrl: existingUser.avatarUrl,
    };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  },

  // Reset password email trigger
  async resetPassword(email) {
    const cleanEmail = email.trim().toLowerCase();
    const registeredUsers = getRegisteredUsers();
    const exists = registeredUsers.some(u => u.email.toLowerCase() === cleanEmail);

    if (!exists) {
      throw new Error('No registered account found with this email.');
    }

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail);
      if (error) throw new Error(error.message);
    }
    return true;
  },

  // Update Profile
  async updateProfile({ fullName, avatarUrl }) {
    const current = this.getCurrentUser();
    if (!current) throw new Error('Not logged in');

    const updated = {
      ...current,
      fullName: fullName || current.fullName,
      avatarUrl: avatarUrl || current.avatarUrl,
    };

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));

    // Update in registered registry
    const registeredUsers = getRegisteredUsers();
    const idx = registeredUsers.findIndex(u => u.id === current.id || u.email.toLowerCase() === current.email.toLowerCase());
    if (idx !== -1) {
      registeredUsers[idx].fullName = updated.fullName;
      registeredUsers[idx].avatarUrl = updated.avatarUrl;
      saveRegisteredUsers(registeredUsers);
    }

    if (isSupabaseConfigured && supabase) {
      await supabase.auth.updateUser({
        data: { full_name: fullName, avatar_url: avatarUrl }
      });
    }

    return updated;
  },

  // Logout user
  async logout() {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(CURRENT_USER_KEY);
  },
};
