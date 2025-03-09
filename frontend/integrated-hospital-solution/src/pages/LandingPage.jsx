import Navbar from "../components/Navbar";

function LandingPage() {
  return (
    <div className="bg-gray-100 text-gray-900 font-sans">
      <Navbar />

      {/* Hero Section */}
      <header className="bg-gradient-to-b from-blue-600 to-purple-600 text-white py-20 text-center">
        <h1 className="text-5xl font-extrabold mb-4">
          Anandam Multi-Speciality Hospitals
        </h1>
        <p className="text-lg max-w-2xl mx-auto">
          Advanced Healthcare Facilities for All!!
        </p>
        {/* <button className="mt-6 bg-white text-blue-600 px-6 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform">
          Get Started
        </button> */}
      </header>

      {/* Features Section */}
      <section className="py-16 px-8 md:px-16 bg-white">
        <h2 className="text-4xl font-bold italic text-center mb-12">
          Our Facilities
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            { value: "800+", text: "Doctors" },
            { value: "50", text: "Specialist Consultants" },
            { value: "3000+", text: "Nurses" },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-gray-200 rounded-xl shadow-md text-center"
            >
              <h3 className="text-2xl font-semibold mb-2">{feature.value}</h3>
              <p className="text-gray-600 text-xl italic">{feature.text}</p>
            </div>
          ))}
        </div>
        <br></br>
        <div className="grid md:grid-cols-2 center gap-10">
          {[
            { value: "5+", text: "Insurance Tie-Ups" },
            { value: "100+", text: "Government aided schemes" },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-gray-200 rounded-xl shadow-md text-center"
            >
              <h3 className="text-2xl font-semibold mb-2">{feature.value}</h3>
              <p className="text-gray-600 text-xl italic">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-200 text-center">
        <h2 className="text-4xl italic font-bold mb-8">Our Happy Patients</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {[
            {
              name: "Rajesh",
              text: "I have spent most of time in the hospital, but it feels like home. 🏡",
            },
            {
              name: "Ramu",
              text: "மற்ற மருத்துவமனைகள் என்னை கைவிட்டார்கள் ஆனால் ஆனந்தம் மருத்துவமனையில் நான் சுகம் பெற்றேன்.",
            },
            {
              name: "Suresh",
              text: "The care given here for my friend was exceptional. 🔥",
            },
          ].map((client, index) => (
            <div key={index} className="w-80 bg-white p-6 rounded-xl shadow-lg">
              <p className="text-gray-700 italic">"{client.text}"</p>
              <h4 className="mt-4 font-bold">- {client.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-3 bg-blue-600 text-white text-center">
        <h2 className="text-3xl italic font-bold mb-2">
          Start Imporving Your Health Today
        </h2>
        <p className="text-lg max-w-2xl mx-auto"></p>

        <a href="mailto:joeldannyj@gmail.com">
          <button className="mt-3 mb-3 bg-white text-blue-600 px-6 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform">
            Contact Us
          </button>
        </a>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-2 text-center">
        <p className="text-m">
          Anandam Multi-Speciality Hospitals. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}

export default LandingPage;
