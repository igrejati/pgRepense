
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLeader: boolean;
  isPastor: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLeader, setIsLeader] = useState(false);
  const [isPastor, setIsPastor] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast: toastHook } = useToast();

  useEffect(() => {
    // First set up auth state listener to avoid race conditions
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setLoading(true);

        if (session) {
          setUser(session.user);
          setSession(session);
          setIsAuthenticated(true);
          
          // Get leader info if user is authenticated
          setTimeout(async () => {
            const { data: leaderData } = await supabase
              .from('leaders')
              .select('role')
              .eq('user_id', session.user.id)
              .maybeSingle();

            setIsLeader(!!leaderData);
            setIsPastor(leaderData?.role === 'pastor');
            setLoading(false);
          }, 0);
        } else {
          setUser(null);
          setSession(null);
          setIsAuthenticated(false);
          setIsLeader(false);
          setIsPastor(false);
          setLoading(false);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        setSession(session);
        setIsAuthenticated(true);
        
        // Get leader info if user is authenticated
        setTimeout(async () => {
          const { data: leaderData } = await supabase
            .from('leaders')
            .select('role')
            .eq('user_id', session.user.id)
            .maybeSingle();

          setIsLeader(!!leaderData);
          setIsPastor(leaderData?.role === 'pastor');
          setLoading(false);
        }, 0);
      } else {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      // For demo/presentation, allow any login credentials
      console.log("Using demo login mode with email:", email);
      
      // For presentation purposes, create a fake user and set auth state
      setUser({ id: 'demo-user', email } as User);
      setIsAuthenticated(true);
      
      // Check if email contains 'pastor' to set role
      if (email.includes('pastor') || email.includes('admin')) {
        setIsLeader(true);
        setIsPastor(true);
      } else {
        setIsLeader(true);
        setIsPastor(false);
      }
      
      return Promise.resolve();
    } catch (error: any) {
      console.error('Login error:', error);
      toastHook({
        variant: 'destructive',
        title: 'Erro de autenticação',
        description: 'Ocorreu um erro durante o login. Por favor, tente novamente.',
      });
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      setIsLeader(false);
      setIsPastor(false);
      
      toast.success("Logout bem-sucedido");
    } catch (error: any) {
      console.error('Logout error:', error);
      toastHook({
        variant: 'destructive',
        title: 'Erro ao sair',
        description: 'Ocorreu um erro ao tentar sair. Por favor, tente novamente.',
      });
    }
  };

  const value = {
    user,
    session,
    isAuthenticated,
    isLeader,
    isPastor,
    loading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
