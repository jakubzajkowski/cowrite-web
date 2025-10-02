import { Link } from 'react-router-dom';
import { useAppNavigation } from '@/hooks/useAppNavigation';

const NotFoundPage = () => {
  const { goBack, ROUTES } = useAppNavigation();

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="py-20">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className="space-x-4">
          <Link
            to={ROUTES.HOME}
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Go Home
          </Link>
          <button
            onClick={goBack}
            className="inline-block border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
