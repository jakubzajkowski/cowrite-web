const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="py-20">
          {/* Header */}
          <div className="mb-16 border-b border-gray-200 pb-12">
            <span className="inline-block px-3 py-1 bg-black text-white text-xs font-medium uppercase tracking-wider mb-6">
              About
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-black mb-6 tracking-tight">
              CoWrite
            </h1>
            <p className="text-xl text-gray-600 font-light leading-relaxed max-w-2xl">
              A minimalist AI-powered markdown editor for intelligent note-taking and focused
              writing
            </p>
          </div>

          {/* Mission Section */}
          <div className="mb-16 space-y-8">
            <div className="border-l-2 border-black pl-8">
              <h2 className="text-3xl font-bold text-black mb-4">What is CoWrite?</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                CoWrite is a minimalist markdown editor that combines the simplicity of local file
                editing with the power of AI assistance. Write, edit, and organize your notes with
                intelligent help at your fingertips.
              </p>
            </div>

            <div className="border-l-2 border-gray-300 pl-8">
              <p className="text-lg text-gray-600 leading-relaxed">
                Currently in MVP, CoWrite lets you work with local markdown files from your computer
                folders, with AI chat to help with writing, grammar, and content improvement. More
                features are coming soon.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-black mb-10">Current Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group p-6 border border-gray-200 hover:border-black transition-all duration-200">
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-black mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-xl font-bold text-black mb-2">AI Chat Assistant</h3>
                    <p className="text-gray-600">
                      Get writing suggestions, grammar help, and content improvements from AI
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-6 border border-gray-200 hover:border-black transition-all duration-200">
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-black mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-xl font-bold text-black mb-2">Local Markdown Files</h3>
                    <p className="text-gray-600">
                      Work with your local folders and markdown documents directly
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-6 border border-gray-200 hover:border-black transition-all duration-200">
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-black mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-xl font-bold text-black mb-2">Rich Text Editor</h3>
                    <p className="text-gray-600">
                      Beautiful markdown editor with live preview and formatting tools
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-6 border border-gray-200 hover:border-black transition-all duration-200">
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-black mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-xl font-bold text-black mb-2">Folder Organization</h3>
                    <p className="text-gray-600">
                      Navigate and manage your local file structure seamlessly
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Coming Soon */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-black mb-10">Coming Soon</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group p-6 border border-gray-200 hover:border-black transition-all duration-200 opacity-75">
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-gray-400 mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-xl font-bold text-black mb-2">AI Agent Mode</h3>
                    <p className="text-gray-600">
                      Let AI autonomously improve and modify your notes
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-6 border border-gray-200 hover:border-black transition-all duration-200 opacity-75">
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-gray-400 mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-xl font-bold text-black mb-2">Cloud Storage</h3>
                    <p className="text-gray-600">Store and sync your notes in the cloud</p>
                  </div>
                </div>
              </div>

              <div className="group p-6 border border-gray-200 hover:border-black transition-all duration-200 opacity-75">
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-gray-400 mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-xl font-bold text-black mb-2">Real-time Collaboration</h3>
                    <p className="text-gray-600">
                      Work together with your team on shared documents
                    </p>
                  </div>
                </div>
              </div>

              <div className="group p-6 border border-gray-200 hover:border-black transition-all duration-200 opacity-75">
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-gray-400 mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-xl font-bold text-black mb-2">Advanced Grammar</h3>
                    <p className="text-gray-600">
                      AI-powered grammar checking and style suggestions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
