import React from 'react';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { useRegister } from '@/lib/api';
import type { RegisterFormData } from '@/lib/validation/auth';

const SignUpPage: React.FC = () => {
  const registerMutation = useRegister();

  const handleSignUp = (data: RegisterFormData) => {
    registerMutation.mutate({
      username: data.username,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <SignUpForm
      onSubmit={handleSignUp}
      isLoading={registerMutation.isPending}
      error={registerMutation.error?.message}
    />
  );
};

export default SignUpPage;
