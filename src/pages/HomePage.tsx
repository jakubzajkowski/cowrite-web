import { useAppNavigation } from '@/hooks/useAppNavigation';

const HomePage = () => {
  const { navigateTo, ROUTES } = useAppNavigation();

  return (
    <div className="h-screen bg-white flex items-center justify-center">
      <div className="max-w-5xl mx-auto px-6 text-center">
        {/* Main Content */}
        <div className="mb-10">
          <div className="mb-6">
            <div className="inline-block w-12 h-12 border-2 border-black mb-6"></div>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-black mb-4 tracking-tighter">
            CoWrite
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            AI-powered markdown editor for focused writing and intelligent note-taking
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-12">
            <button
              onClick={() => navigateTo(ROUTES.NOTES)}
              className="w-full sm:w-auto px-8 py-3 bg-black text-white text-base font-medium hover:bg-gray-800 transition-all duration-200"
            >
              Start Writing
            </button>
            <button
              onClick={() => navigateTo(ROUTES.ABOUT)}
              className="w-full sm:w-auto px-8 py-3 border-2 border-black text-black text-base font-medium hover:bg-black hover:text-white transition-all duration-200"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Features - Horizontal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="group">
            <div className="w-10 h-10 border border-black mx-auto mb-3 flex items-center justify-center transition-all duration-300 group-hover:bg-black">
              <svg
                className="h-5 w-5 text-black group-hover:text-white transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3 className="text-base font-bold mb-1 text-black">AI Assistant</h3>
            <p className="text-sm text-gray-600">Chat with AI for writing help</p>
          </div>

          <div className="group">
            <div className="w-10 h-10 border border-black mx-auto mb-3 flex items-center justify-center transition-all duration-300 group-hover:bg-black">
              <svg
                className="h-5 w-5 text-black group-hover:text-white transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <h3 className="text-base font-bold mb-1 text-black">Markdown Editor</h3>
            <p className="text-sm text-gray-600">Local files, rich formatting</p>
          </div>

          <div className="group">
            <div className="w-10 h-10 border border-black mx-auto mb-3 flex items-center justify-center transition-all duration-300 group-hover:bg-black">
              <svg
                className="h-5 w-5 text-black group-hover:text-white transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-base font-bold mb-1 text-black">Local First</h3>
            <p className="text-sm text-gray-600">Your files, your folders</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
