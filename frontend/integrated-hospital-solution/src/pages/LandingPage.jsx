import Navbar from "../components/Navbar";

function LandingPage() {
  return (
    <div className="bg-gray-100 text-gray-900 font-sans">
      <Navbar />

      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 text-center">
        <h1 className="text-5xl font-extrabold mb-4">Integrated Hospital Solution</h1>
        <p className="text-lg max-w-2xl mx-auto">
          Revolutionizing healthcare with optimized patient care, seamless communication, and efficient staff management.
        </p>
        <button className="mt-6 bg-white text-blue-600 px-6 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform">
          Get Started
        </button>
      </header>

      {/* Features Section */}
      <section className="py-16 px-8 md:px-16 bg-white">
        <h2 className="text-4xl font-bold text-center mb-12">How We Solve Healthcare Challenges</h2>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            "Optimized Patient Stay",
            "Transparent Communication",
            "Staff Efficiency & Well-being",
            "Faster Decision Making",
            "Seamless Medical Records",
            "Insurance Accessibility",
            "Well-Coordinated Departments",
          ].map((feature, index) => (
            <div key={index} className="p-6 bg-gray-100 rounded-xl shadow-md text-center">
              <h3 className="text-2xl font-semibold mb-2">{feature}</h3>
              <p className="text-gray-600">Ensuring seamless healthcare operations for better patient outcomes.</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-200 text-center">
        <h2 className="text-4xl font-bold mb-8">What Our Clients Say</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {["Hospital A", "Clinic B", "Healthcare Center C"].map((client, index) => (
            <div key={index} className="w-80 bg-white p-6 rounded-xl shadow-lg">
              <p className="text-gray-700 italic">“This system has transformed our workflow and improved patient satisfaction tremendously!”</p>
              <h4 className="mt-4 font-bold">- {client}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white text-center">
        <h2 className="text-4xl font-bold mb-4">Start Transforming Your Hospital Today</h2>
        <p className="text-lg max-w-2xl mx-auto">
          Enhance patient care, improve staff efficiency, and streamline medical operations with our all-in-one solution.
        </p>
        <button className="mt-6 bg-white text-blue-600 px-6 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform">
          Contact Us
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 text-center">
        <p className="text-lg">&copy; 2024 Integrated Hospital Solution. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;