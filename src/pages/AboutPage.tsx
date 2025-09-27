const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">About CoWrite</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            CoWrite is a modern collaborative writing platform designed to help teams
            work together seamlessly on documents, articles, and creative content.
          </p>
          <p className="text-gray-600 mb-6">
            Our mission is to make collaborative writing as smooth and intuitive as
            possible, with real-time editing, version control, and powerful
            collaboration features.
          </p>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Features</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Real-time collaborative editing</li>
            <li>Version history and rollback</li>
            <li>Comments and suggestions</li>
            <li>Team management</li>
            <li>Export to multiple formats</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;