import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registerSchema, type RegisterFormData } from '@/lib/validation/auth';

interface SignUpFormProps {
  onSubmit: (data: RegisterFormData) => void;
  isLoading?: boolean;
  error?: string;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({ onSubmit, isLoading = false, error }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const password = watch('password');

  // Function to check password strength
  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, label: '', color: '' };

    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z\d]/.test(password)) score++;

    const levels = [
      { label: 'Very weak', color: 'bg-red-500' },
      { label: 'Weak', color: 'bg-orange-500' },
      { label: 'Fair', color: 'bg-yellow-500' },
      { label: 'Good', color: 'bg-blue-500' },
      { label: 'Very strong', color: 'bg-green-500' },
    ];

    return { score, ...levels[Math.min(score - 1, 4)] };
  };

  const passwordStrength = getPasswordStrength(password || '');

  return (
    <div className="h-screen bg-white flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-black text-white items-center justify-center p-12">
        <div className="max-w-md">
          <h1 className="text-6xl font-bold mb-6 tracking-tight">CoWrite</h1>
          <p className="text-xl text-gray-400 font-light leading-relaxed">
            Start your journey with AI-powered note-taking
          </p>
          <div className="mt-12 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-1 bg-white"></div>
              <span className="text-gray-400">AI writing assistance</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-1 h-1 bg-white"></div>
              <span className="text-gray-400">Markdown editor</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-1 h-1 bg-white"></div>
              <span className="text-gray-400">Local files support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-black mb-2 tracking-tight">Create Account</h2>
            <p className="text-gray-600">Get started for free</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && <div className="p-4 bg-black text-white text-sm">{error}</div>}

            {/* Username Field */}
            <div className="space-y-1">
              <Label
                htmlFor="username"
                className="text-xs font-medium text-gray-500 uppercase tracking-wider ml-1"
              >
                Username
              </Label>
              <div className="relative group">
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  className="w-full h-11 px-4 bg-white border-b-2 border-gray-200 text-black focus:outline-none focus:border-black transition-colors text-base rounded-none"
                  {...register('username')}
                />
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-focus-within:w-full"></div>
              </div>
              {errors.username && (
                <p className="text-xs text-black ml-1 mt-1">{errors.username.message}</p>
              )}
            </div>

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
                  className="w-full h-11 px-4 bg-white border-b-2 border-gray-200 text-black focus:outline-none focus:border-black transition-colors text-base rounded-none"
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
                  placeholder="Create a strong password"
                  className="w-full h-11 px-4 pr-12 bg-white border-b-2 border-gray-200 text-black focus:outline-none focus:border-black transition-colors text-base rounded-none"
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
              {password && passwordStrength.score > 0 && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-500">Strength:</span>
                    <span className="text-black font-medium">{passwordStrength.label}</span>
                  </div>
                  <div className="w-full bg-gray-200 h-0.5">
                    <div
                      className="h-0.5 bg-black transition-all duration-300"
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              {errors.password && (
                <p className="text-xs text-black ml-1 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1">
              <Label
                htmlFor="confirmPassword"
                className="text-xs font-medium text-gray-500 uppercase tracking-wider ml-1"
              >
                Confirm Password
              </Label>
              <div className="relative group">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  className="w-full h-11 px-4 pr-12 bg-white border-b-2 border-gray-200 text-black focus:outline-none focus:border-black transition-colors text-base rounded-none"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-focus-within:w-full"></div>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-black ml-1 mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="pt-3">
              <label className="flex items-start space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="w-4 h-4 mt-0.5 border border-gray-300 checked:bg-black checked:border-black focus:ring-0 focus:ring-offset-0 flex-shrink-0"
                />
                <span className="text-xs text-gray-600 leading-relaxed group-hover:text-black transition-colors">
                  I accept the{' '}
                  <Link to="/terms" className="text-black underline hover:no-underline font-medium">
                    terms
                  </Link>{' '}
                  and{' '}
                  <Link
                    to="/privacy"
                    className="text-black underline hover:no-underline font-medium"
                  >
                    privacy policy
                  </Link>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-11 bg-black text-white text-base font-medium hover:bg-gray-800 focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              disabled={!isValid || isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating account
                </span>
              ) : (
                'Create Account'
              )}
            </button>

            {/* Sign In Link */}
            <div className="text-center text-sm pt-6">
              <span className="text-gray-600">Already have an account? </span>
              <Link to="/signin" className="text-black hover:underline font-bold">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
