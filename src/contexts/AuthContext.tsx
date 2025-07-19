import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  confirmPasswordReset
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { supabase } from '../config/supabase';
import { supabaseAdmin } from '../config/supabaseAdmin';

interface SupabaseUser {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  provider: string;
  status: boolean;
  birth_date?: string;
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  currentUser: User | null;
  supabaseUser: SupabaseUser | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  confirmPasswordReset: (code: string, newPassword: string) => Promise<void>;
  updateUserProfile: (data: Partial<SupabaseUser>) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const googleProvider = new GoogleAuthProvider();

  const checkAndCreateUser = async (user: User) => {
    try {
      console.log('Checking user:', user.email);
      
      // Check if user exists in users table
      const { data: existingUser, error: checkError } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is expected for new users
        console.error('Error checking user:', checkError);
        throw checkError;
      }

      if (existingUser && !checkError) {
        // User exists, update supabaseUser state
        setSupabaseUser(existingUser);
        console.log('User found in database:', existingUser);
        
        // Check if we need to update any missing data from Firebase
        const needsUpdate = 
          (!existingUser.full_name && user.displayName) ||
          (!existingUser.avatar_url && user.photoURL) ||
          (existingUser.provider !== (user.providerData[0]?.providerId || 'password'));
        
        if (needsUpdate) {
          console.log('Updating existing user with new Firebase data');
          const updateData = {
            ...(user.displayName && !existingUser.full_name && { full_name: user.displayName }),
            ...(user.photoURL && !existingUser.avatar_url && { avatar_url: user.photoURL }),
            provider: user.providerData[0]?.providerId || 'password',
            updated_at: new Date().toISOString()
          };
          
          const { data: updatedUser, error: updateError } = await supabaseAdmin
            .from('users')
            .update(updateData)
            .eq('email', user.email)
            .select()
            .single();
          
          if (updateError) {
            console.error('Error updating existing user:', updateError);
          } else {
            setSupabaseUser(updatedUser);
            console.log('User updated successfully:', updatedUser);
          }
        }
      } else {
        // User doesn't exist, create new user  
        console.log('Creating new user for:', user.email);
        const newUserData = {
          email: user.email || '',
          full_name: user.displayName || user.email?.split('@')[0] || '',
          avatar_url: user.photoURL || null,
          provider: user.providerData[0]?.providerId || 'password',
          status: false, // Default status is false
          birth_date: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        console.log('New user data to insert:', newUserData);
        
        const { data: createdUser, error: createError } = await supabaseAdmin
          .from('users')
          .insert(newUserData)
          .select()
          .single();

        if (createError) {
          console.error('Error creating user:', createError);
          throw createError;
        } else {
          setSupabaseUser(createdUser);
          console.log('New user created:', createdUser);
        }
      }
    } catch (error) {
      console.error('Error in checkAndCreateUser:', error);
      throw error;
    }
  };

  const updateUserProfile = async (data: Partial<SupabaseUser>) => {
    if (!currentUser || !supabaseUser) {
      throw new Error('No user logged in');
    }

    try {
      console.log('Updating user profile:', data);
      
      const updateData = {
        ...data,
        updated_at: new Date().toISOString()
      };

      const { data: updatedUser, error } = await supabaseAdmin
        .from('users')
        .update(updateData)
        .eq('id', supabaseUser.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating user profile:', error);
        throw error;
      }

      setSupabaseUser(updatedUser);
      console.log('User profile updated successfully:', updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  const signup = async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      await checkAndCreateUser(userCredential.user);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await checkAndCreateUser(userCredential.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      await checkAndCreateUser(userCredential.user);
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setSupabaseUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  const confirmPasswordResetHandler = async (code: string, newPassword: string) => {
    try {
      await confirmPasswordReset(auth, code, newPassword);
    } catch (error) {
      console.error('Confirm password reset error:', error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setCurrentUser(user);
        if (user) {
          await checkAndCreateUser(user);
        } else {
          setSupabaseUser(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        // Don't throw here to prevent infinite loops
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    supabaseUser,
    login,
    signup,
    loginWithGoogle,
    logout,
    resetPassword,
    confirmPasswordReset: confirmPasswordResetHandler,
    updateUserProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};