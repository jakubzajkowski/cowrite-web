const ContactPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <div className="py-20">
          {/* Header */}
          <div className="mb-16">
            <span className="inline-block px-3 py-1 bg-black text-white text-xs font-medium uppercase tracking-wider mb-6">
              Contact
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-black mb-6 tracking-tight">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 font-light leading-relaxed">
              Have questions or feedback? We'd love to hear from you.
            </p>
          </div>

          {/* Contact Form */}
          <form className="space-y-8">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-bold text-black uppercase tracking-wider"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-4 py-4 bg-white border-2 border-gray-200 text-black focus:outline-none focus:border-black transition-colors text-lg"
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-bold text-black uppercase tracking-wider"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-4 bg-white border-2 border-gray-200 text-black focus:outline-none focus:border-black transition-colors text-lg"
                placeholder="your.email@example.com"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="message"
                className="block text-sm font-bold text-black uppercase tracking-wider"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                className="w-full px-4 py-4 bg-white border-2 border-gray-200 text-black focus:outline-none focus:border-black transition-colors text-lg resize-none"
                placeholder="Write your message here..."
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-black text-white py-4 px-8 text-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02]"
              >
                Send Message →
              </button>
            </div>
          </form>

          {/* Additional Info */}
          <div className="mt-20 pt-12 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-black uppercase tracking-wider">Email</h3>
                <p className="text-lg text-gray-600">hello@cowrite.com</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-black uppercase tracking-wider">
                  Response Time
                </h3>
                <p className="text-lg text-gray-600">Within 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
