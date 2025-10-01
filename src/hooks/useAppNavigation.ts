import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback } from 'react';
import { ROUTES, type RoutePath } from '@/routes/config';

/**
 * Custom hook for navigation with type safety
 */
export const useAppNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateTo = useCallback((path: RoutePath, options?: { replace?: boolean }) => {
    navigate(path, options);
  }, [navigate]);

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const goForward = useCallback(() => {
    navigate(1);
  }, [navigate]);

  const isCurrentPath = useCallback((path: RoutePath) => {
    return location.pathname === path;
  }, [location.pathname]);

  const getCurrentPath = useCallback(() => {
    return location.pathname as RoutePath;
  }, [location.pathname]);

  return {
    navigateTo,
    goBack,
    goForward,
    isCurrentPath,
    getCurrentPath,
    location,
    ROUTES,
  };
};