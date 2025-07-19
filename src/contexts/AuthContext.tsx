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
      // Check if user exists in users table
      const { data: existingUser, error: checkError } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is expected for new users
        throw checkError;
      }

      if (existingUser && !checkError) {
        // User exists, update supabaseUser state
        setSupabaseUser(existingUser);
        
        // Check if we need to update any missing data from Firebase
        const needsUpdate = 
          (!existingUser.full_name && user.displayName) ||
          (!existingUser.avatar_url && user.photoURL) ||
          (existingUser.provider !== (user.providerData[0]?.providerId || 'password'));
        
        if (needsUpdate) {
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
          } else {
            setSupabaseUser(updatedUser);
          }
        }
      } else {
        // User doesn't exist, create new user  
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

        const { data: createdUser, error: createError } = await supabaseAdmin
          .from('users')
          .insert(newUserData)
          .select()
          .single();

        if (createError) {
          throw createError;
        } else {
          setSupabaseUser(createdUser);
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const updateUserProfile = async (data: Partial<SupabaseUser>) => {
    if (!currentUser || !supabaseUser) {
      throw new Error('No user logged in');
    }

    try {
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
        throw error;
      }

      setSupabaseUser(updatedUser);
      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      await checkAndCreateUser(userCredential.user);
    } catch (error) {
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await checkAndCreateUser(userCredential.user);
    } catch (error) {
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      await checkAndCreateUser(userCredential.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setSupabaseUser(null);
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  };

  const confirmPasswordResetHandler = async (code: string, newPassword: string) => {
    try {
      await confirmPasswordReset(auth, code, newPassword);
    } catch (error) {
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