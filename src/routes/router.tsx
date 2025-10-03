import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import RootLayout from '@/layouts/RootLayout';
import { ROUTES } from './config';
import { ProtectedRoute } from '@/lib/auth';

// Lazy load pages for better performance
const HomePage = lazy(() => import('@/pages/HomePage'));
const NotesApp = lazy(() => import('@/pages/NotesApp'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const SignInPage = lazy(() => import('@/pages/SignInPage'));
const SignUpPage = lazy(() => import('@/pages/SignUpPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// Loading component for lazy loaded routes
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

// Wrapper for lazy loaded components
const LazyWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

// Create router configuration
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <LazyWrapper>
            <HomePage />
          </LazyWrapper>
        ),
      },
      {
        path: ROUTES.ABOUT,
        element: (
          <LazyWrapper>
            <AboutPage />
          </LazyWrapper>
        ),
      },
      {
        path: ROUTES.CONTACT,
        element: (
          <LazyWrapper>
            <ContactPage />
          </LazyWrapper>
        ),
      },
      {
        path: ROUTES.SIGNIN,
        element: (
          <LazyWrapper>
            <SignInPage />
          </LazyWrapper>
        ),
      },
      {
        path: ROUTES.SIGNUP,
        element: (
          <LazyWrapper>
            <SignUpPage />
          </LazyWrapper>
        ),
      },
      {
        path: ROUTES.NOT_FOUND,
        element: (
          <LazyWrapper>
            <NotFoundPage />
          </LazyWrapper>
        ),
      },
    ],
  },
  // Standalone Notes App (fullscreen)
  {
    path: ROUTES.NOTES,
    element: (
      <ProtectedRoute>
        <LazyWrapper>
          <NotesApp />
        </LazyWrapper>
      </ProtectedRoute>
    ),
  },
]);
