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

  const authItems = [
    { path: ROUTES.SIGNIN, label: 'Sign In' },
    { path: ROUTES.SIGNUP, label: 'Sign Up' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to={ROUTES.HOME} className="text-xl font-bold text-gray-900">
            CoWrite
          </Link>
          <div className="flex items-center space-x-8">
            <div className="flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                    isCurrentPath(item.path)
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              {authItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    item.path === ROUTES.SIGNIN
                      ? 'text-gray-700 hover:text-blue-600'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;