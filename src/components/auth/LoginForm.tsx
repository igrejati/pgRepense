
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  email: z.string().email({ message: 'Por favor, insira um email válido.' }),
  password: z.string().min(1, {
    message: 'A senha é obrigatória.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);

    try {
      // Bypass authentication - accept any email/password
      setTimeout(() => {
        // Simulate a delay as if we're authenticating
        
        // Determine where to redirect based on email domain
        if (values.email.includes('pastor') || 
            values.email.includes('admin') || 
            values.email === 'flavio@gmail.com' || 
            values.email === 'rafael@igrejared.com') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }

        toast({
          title: 'Login bem-sucedido!',
          description: 'Bem-vindo ao Portal de Gestão de Cursos Repense.',
        });
        
        setIsLoading(false);
      }, 800); // Simulate network delay
      
    } catch (error: any) {
      console.error('Login error:', error);
      setIsLoading(false);
      toast({
        variant: 'destructive',
        title: 'Erro de autenticação',
        description: 'Ocorreu um erro durante o login. Por favor, tente novamente.',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="seu@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full bg-repense-red hover:bg-opacity-90" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Entrando...
            </>
          ) : (
            'Entrar'
          )}
        </Button>
        <div className="text-center mt-4">
          <a href="/signup" className="text-repense-red hover:underline">
            Criar uma nova conta
          </a>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
