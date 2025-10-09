import { Link } from 'react-router-dom';
import { useAppNavigation } from '@/hooks/useAppNavigation';

const Navigation = () => {
  const { isCurrentPath, ROUTES } = useAppNavigation();

  const navItems = [
    { path: ROUTES.HOME, label: 'Home' },
    { path: ROUTES.NOTES, label: 'Notes' },
    { path: ROUTES.ABOUT, label: 'About' },
    { path: ROUTES.CONTACT, label: 'Contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo with Square */}
          <Link to={ROUTES.HOME} className="flex items-center space-x-3 group">
            <div className="w-8 h-8 border-2 border-black transition-all duration-200 group-hover:bg-black"></div>
            <span className="text-xl font-bold text-black tracking-tight">CoWrite</span>
          </Link>

          <div className="flex items-center space-x-8">
            {/* Navigation Links */}
            <div className="flex space-x-6">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors relative py-1 ${
                    isCurrentPath(item.path) ? 'text-black' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  {item.label}
                  {isCurrentPath(item.path) && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black"></div>
                  )}
                </Link>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-3">
              <Link
                to={ROUTES.SIGNIN}
                className="px-4 py-2 text-sm font-medium text-black hover:text-gray-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to={ROUTES.SIGNUP}
                className="px-4 py-2 text-sm font-medium bg-black text-white hover:bg-gray-800 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
