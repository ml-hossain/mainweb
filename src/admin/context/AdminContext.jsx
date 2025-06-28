import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const AdminContext = createContext();

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

export function AdminProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (mounted) {
          setSession(session);
          if (session) {
            await fetchUser(session.user.id);
          }
          setAuthChecked(true);
        }
      } catch (error) {
        console.error('Session check error:', error);
        if (mounted) {
          setError(error.message);
          setAuthChecked(true);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (mounted) {
        setSession(session);
        if (session) {
          await fetchUser(session.user.id);
        } else {
          setUser(null);
        }
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  async function fetchUser(userId) {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      if (!data) {
        throw new Error('User not found in admin_users table');
      }

      setUser(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching user:', error);
      setError(error.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function signIn({ email, password }) {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if user is an admin or editor
      const { data: adminUser, error: roleError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (roleError) throw roleError;

      if (!adminUser) {
        throw new Error('Unauthorized access. Please contact your administrator.');
      }

      setUser(adminUser);
      return { error: null };
    } catch (error) {
      setError(error.message);
      return { error };
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      setUser(null);
      setSession(null);
    }
  }

  async function updateProfile(updates) {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('admin_users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setUser(data);
      return { error: null, data };
    } catch (error) {
      setError(error.message);
      return { error };
    } finally {
      setLoading(false);
    }
  }

  const isAdmin = user?.role === 'admin';
  const isEditor = user?.role === 'editor';

  const value = {
    session,
    user,
    loading,
    error,
    authChecked,
    signIn,
    signOut,
    updateProfile,
    isAdmin,
    isEditor,
    clearError: () => setError(null),
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export default AdminContext; 