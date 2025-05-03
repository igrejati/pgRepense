
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  isLeader: boolean;
  isPastor: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    isAuthenticated: false,
    isLeader: false,
    isPastor: false,
  });

  useEffect(() => {
    // First set up auth state listener to avoid race conditions
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setAuthState(prev => ({
          ...prev, 
          loading: true
        }));

        if (session) {
          // Get leader info if user is authenticated
          const { data: leaderData } = await supabase
            .from('leaders')
            .select('role')
            .eq('user_id', session.user.id)
            .single();

          const isLeader = !!leaderData;
          const isPastor = leaderData?.role === 'pastor';

          setAuthState({
            user: session.user,
            session,
            loading: false,
            isAuthenticated: true,
            isLeader,
            isPastor,
          });
        } else {
          setAuthState({
            user: null,
            session: null,
            loading: false,
            isAuthenticated: false,
            isLeader: false,
            isPastor: false,
          });
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Get leader info if user is authenticated
        setTimeout(async () => {
          const { data: leaderData } = await supabase
            .from('leaders')
            .select('role')
            .eq('user_id', session.user.id)
            .single();

          const isLeader = !!leaderData;
          const isPastor = leaderData?.role === 'pastor';

          setAuthState({
            user: session.user,
            session,
            loading: false,
            isAuthenticated: true,
            isLeader,
            isPastor,
          });
        }, 0);
      } else {
        setAuthState(prev => ({
          ...prev,
          loading: false,
        }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return authState;
}

export function useRequireAuth(redirectTo = '/login') {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.loading && !auth.isAuthenticated) {
      navigate(redirectTo);
    }
  }, [auth.loading, auth.isAuthenticated, navigate, redirectTo]);

  return auth;
}

export function useRequireLeader(redirectTo = '/login') {
  const auth = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!auth.loading) {
      if (!auth.isAuthenticated) {
        navigate(redirectTo);
      } else if (auth.isAuthenticated && !auth.isLeader) {
        toast({
          title: 'Acesso restrito',
          description: 'Você não tem permissão para acessar esta página.',
          variant: 'destructive',
        });
        navigate('/');
      }
    }
  }, [auth.loading, auth.isAuthenticated, auth.isLeader, navigate, redirectTo, toast]);

  return auth;
}

export function useRequirePastor(redirectTo = '/login') {
  const auth = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!auth.loading) {
      if (!auth.isAuthenticated) {
        navigate(redirectTo);
      } else if (auth.isAuthenticated && !auth.isPastor) {
        toast({
          title: 'Acesso restrito',
          description: 'Área exclusiva para pastores.',
          variant: 'destructive',
        });
        navigate('/dashboard');
      }
    }
  }, [auth.loading, auth.isAuthenticated, auth.isPastor, navigate, redirectTo, toast]);

  return auth;
}
