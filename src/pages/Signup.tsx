
import React from 'react';
import SignupForm from '@/components/auth/SignupForm';

const Signup = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Image/Brand */}
      <div className="hidden md:flex md:w-1/2 bg-repense-red items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="mb-8">
            <div className="w-48 h-48 mx-auto rounded-full bg-white flex items-center justify-center p-4">
              {/* Logo image */}
              <img 
                src="/images/repense-logo.png" 
                alt="Repense Logo" 
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Repense Course Compass</h1>
          <p className="text-white opacity-90">
            Administre seus cursos de discipulado, acompanhe o progresso dos alunos e obtenha insights valiosos.
          </p>
        </div>
      </div>

      {/* Right side - Signup Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="md:hidden mb-8">
              <div className="w-20 h-20 mx-auto rounded-full bg-white flex items-center justify-center p-2">
                <img 
                  src="/images/repense-logo.png" 
                  alt="Repense Logo" 
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Cadastro de Novo Líder
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Preencha o formulário para criar sua conta.
            </p>
          </div>

          <SignupForm />
        </div>
      </div>
    </div>
  );
};

export default Signup;
