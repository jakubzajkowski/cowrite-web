import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginSchema, type LoginFormData } from '@/lib/validation/auth';

interface SignInFormProps {
  onSubmit: (data: LoginFormData) => void;
  isLoading?: boolean;
  error?: string;
}

export const SignInForm: React.FC<SignInFormProps> = ({ onSubmit, isLoading = false, error }) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  return (
    <div className="h-screen bg-white flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-black text-white items-center justify-center p-12">
        <div className="max-w-md">
          <h1 className="text-6xl font-bold mb-6 tracking-tight">CoWrite</h1>
          <p className="text-xl text-gray-400 font-light leading-relaxed">
            AI-powered markdown editor for intelligent note-taking
          </p>
          <div className="mt-12 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-1 bg-white"></div>
              <span className="text-gray-400">AI chat assistant</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-1 h-1 bg-white"></div>
              <span className="text-gray-400">Local markdown files</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-1 h-1 bg-white"></div>
              <span className="text-gray-400">Distraction-free writing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h2 className="text-4xl font-bold text-black mb-2 tracking-tight">Sign In</h2>
            <p className="text-gray-600">Continue to your workspace</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && <div className="p-4 bg-black text-white text-sm">{error}</div>}

            {/* Email Field */}
            <div className="space-y-1">
              <Label
                htmlFor="email"
                className="text-xs font-medium text-gray-500 uppercase tracking-wider ml-1"
              >
                Email
              </Label>
              <div className="relative group">
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  className="w-full h-12 px-4 bg-white border-b-2 border-gray-200 text-black focus:outline-none focus:border-black transition-colors text-base rounded-none"
                  {...register('email')}
                />
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-focus-within:w-full"></div>
              </div>
              {errors.email && (
                <p className="text-xs text-black ml-1 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <Label
                htmlFor="password"
                className="text-xs font-medium text-gray-500 uppercase tracking-wider ml-1"
              >
                Password
              </Label>
              <div className="relative group">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="w-full h-12 px-4 pr-12 bg-white border-b-2 border-gray-200 text-black focus:outline-none focus:border-black transition-colors text-base rounded-none"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-focus-within:w-full"></div>
              </div>
              {errors.password && (
                <p className="text-xs text-black ml-1 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm pt-2">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 border border-gray-300 checked:bg-black checked:border-black focus:ring-0 focus:ring-offset-0"
                />
                <span className="text-gray-600 group-hover:text-black transition-colors">
                  Remember me
                </span>
              </label>
              <Link to="/forgot-password" className="text-black hover:underline font-medium">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-12 bg-black text-white text-base font-medium hover:bg-gray-800 focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
              disabled={!isValid || isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in
                </span>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Sign Up Link */}
            <div className="text-center text-sm pt-6">
              <span className="text-gray-600">Don't have an account? </span>
              <Link to="/signup" className="text-black hover:underline font-bold">
                Create one
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
