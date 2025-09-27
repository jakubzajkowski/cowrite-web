import { useAppNavigation } from '@/hooks/useAppNavigation';

const HomePage = () => {
  const { navigateTo, ROUTES } = useAppNavigation();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to CoWrite
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your modern note-taking and collaborative writing platform
        </p>
        <div className="space-x-4">
          <button 
            onClick={() => navigateTo(ROUTES.NOTES)}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Start Writing
          </button>
          <button 
            onClick={() => navigateTo(ROUTES.ABOUT)}
            className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Learn More
          </button>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Rich Editor</h3>
            <p className="text-gray-600">Powerful TipTap editor with markdown support and rich formatting options.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Organization</h3>
            <p className="text-gray-600">Organize your notes with folders, tags, and search functionality.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Collaboration</h3>
            <p className="text-gray-600">Share and collaborate on documents with your team in real-time.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;