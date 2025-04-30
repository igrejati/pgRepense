
import React from 'react';
import LoginForm from '@/components/auth/LoginForm';

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Image/Brand */}
      <div className="hidden md:flex md:w-1/2 bg-repense-red items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="mb-8">
            <div className="w-48 h-48 mx-auto rounded-full bg-white flex items-center justify-center">
              {/* Replace with logo image when available */}
              <div className="text-5xl font-bold text-repense-red">R</div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Repense Course Compass</h1>
          <p className="text-white opacity-90">
            Administre seus cursos de discipulado, acompanhe o progresso dos alunos e obtenha insights valiosos.
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="md:hidden mb-8">
              <div className="w-20 h-20 mx-auto rounded-full bg-repense-red flex items-center justify-center">
                <div className="text-2xl font-bold text-white">R</div>
              </div>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Bem-vindo ao Portal Repense
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Entre com suas credenciais para acessar a plataforma.
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
