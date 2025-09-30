import React from 'react';
import { SignInForm } from '@/components/auth/SignInForm';
import { useLogin } from '@/lib/api';
import type { LoginFormData } from '@/lib/validation/auth';

const SignInPage: React.FC = () => {
  const loginMutation = useLogin();

  const handleSignIn = (data: LoginFormData) => {
    loginMutation.mutate({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <SignInForm 
      onSubmit={handleSignIn} 
      isLoading={loginMutation.isPending}
      error={loginMutation.error?.message}
    />
  );
};

export default SignInPage;