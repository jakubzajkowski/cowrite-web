import { Link } from 'react-router-dom';
import { useAppNavigation } from '@/hooks/useAppNavigation';

const NotFoundPage = () => {
  const { goBack, ROUTES } = useAppNavigation();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <div className="mb-12">
          <div className="mb-8">
            <span className="inline-block w-20 h-20 border-4 border-black mb-8"></span>
          </div>
          <h1 className="text-9xl font-bold text-black mb-6 tracking-tighter">404</h1>
          <h2 className="text-3xl font-bold text-black mb-4">Page Not Found</h2>
          <p className="text-xl text-gray-600 font-light leading-relaxed max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to={ROUTES.HOME}
            className="w-full sm:w-auto px-8 py-4 bg-black text-white font-medium hover:bg-gray-800 transition-all duration-200 transform hover:scale-105"
          >
            Go Home
          </Link>
          <button
            onClick={goBack}
            className="w-full sm:w-auto px-8 py-4 border-2 border-black text-black font-medium hover:bg-black hover:text-white transition-all duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
