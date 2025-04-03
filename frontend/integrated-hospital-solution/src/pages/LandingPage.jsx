import Navbar from "../components/Navbar";
import TestPdfViewer from "../components/Test";

function LandingPage() {
  return (
    <div className="bg-[#E8F6FC] text-gray-800 font-sans">
      <Navbar />

      {/* Hero Section */}
      <header className="bg-[#404E7C] text-white py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Anandam Multi-Speciality Hospitals
          </h1>
          <p className="text-lg max-w-2xl mb-6 text-[#D0EAF4]">
            Advanced Healthcare Facilities for All
          </p>
          <div className="mt-6 space-x-4">
            <button className="bg-[#A5D8F3] text-[#404E7C] px-6 py-3 rounded font-medium hover:bg-[#8bc0e5] transition-all">
              Book Appointment
            </button>
            <button className="border border-[#A5D8F3] text-[#A5D8F3] px-6 py-3 rounded font-medium hover:bg-[#404E7C] transition-all">
              Learn More
            </button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-[#404E7C] text-center mb-12">
            Our Healthcare Facilities
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { value: "800+", text: "Qualified Doctors" },
              { value: "50", text: "Specialist Consultants" },
              { value: "3000+", text: "Professional Nurses" },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-[#E8F6FC] rounded-lg border-l-4 border-[#404E7C] shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-3xl font-bold text-[#404E7C] mb-2">
                  {feature.value}
                </h3>
                <p className="text-gray-600">{feature.text}</p>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            {[
              { value: "5+", text: "Insurance Provider Partnerships" },
              { value: "100+", text: "Government Aided Healthcare Schemes" },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-[#E8F6FC] rounded-lg border-l-4 border-[#404E7C] shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-3xl font-bold text-[#404E7C] mb-2">
                  {feature.value}
                </h3>
                <p className="text-gray-600">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section (New) */}
      <section className="py-16 px-4 md:px-8 bg-[#D0EAF4]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-[#404E7C] text-center mb-12">
            Our Medical Services
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Cardiology",
                description:
                  "Comprehensive cardiac care with advanced diagnostic and treatment facilities",
              },
              {
                title: "Neurology",
                description:
                  "Specialized treatment for neurological disorders with expert neurologists",
              },
              {
                title: "Orthopedics",
                description:
                  "Complete bone and joint care with modern surgical techniques",
              },
              {
                title: "Pediatrics",
                description:
                  "Child-focused healthcare from newborns to adolescents",
              },
              {
                title: "Oncology",
                description:
                  "Cancer treatment with multidisciplinary approach and support services",
              },
              {
                title: "Emergency Care",
                description:
                  "24/7 emergency services with rapid response teams",
              },
            ].map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-[#404E7C] mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-[#404E7C] text-center mb-12">
            Patient Testimonials
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Rajesh Kumar",
                position: "Cardiac Patient",
                text: "I have spent significant time at Anandam Hospital, but their compassionate care made it feel like home.",
              },
              {
                name: "Ramu Subramaniam",
                position: "Neurology Patient",
                text: "மற்ற மருத்துவமனைகள் என்னை கைவிட்டார்கள் ஆனால் ஆனந்தம் மருத்துவமனையில் நான் சுகம் பெற்றேன்.",
              },
              {
                name: "Suresh Reddy",
                position: "Family Member",
                text: "The care provided to my friend at Anandam was exceptional. The doctors were attentive and the staff was supportive throughout.",
              },
            ].map((client, index) => (
              <div
                key={index}
                className="bg-[#E8F6FC] p-6 rounded-lg shadow-sm"
              >
                <p className="text-gray-700">"{client.text}"</p>
                <div className="mt-4">
                  <h4 className="font-semibold text-[#404E7C]">
                    {client.name}
                  </h4>
                  <p className="text-sm text-gray-500">{client.position}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4 md:px-8 bg-[#404E7C] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Start Improving Your Health Today
          </h2>
          <p className="text-[#D0EAF4] mb-8">
            Schedule a consultation with our specialists to begin your journey
            to better health
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:+1234567890">
              <button className="bg-[#A5D8F3] text-[#404E7C] px-6 py-3 rounded font-medium hover:bg-[#8bc0e5] transition-all">
                Call Us
              </button>
            </a>
            <a href="mailto:joeldannyj@gmail.com">
              <button className="bg-transparent border border-[#A5D8F3] text-[#A5D8F3] px-6 py-3 rounded font-medium hover:bg-[#2a3456] transition-all">
                Email Us
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2a3456] text-white py-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Anandam Hospitals</h3>
              <p className="text-[#A5D8F3]">
                Advanced Healthcare Facilities for All
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact</h3>
              <p>123 Hospital Road</p>
              <p>Chennai, Tamil Nadu 600001</p>
              <p>Phone: +91 1234567890</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Hours</h3>
              <p>Emergency: 24/7</p>
              <p>Outpatient: 8:00 AM - 8:00 PM</p>
              <p>Visiting: 10:00 AM - 6:00 PM</p>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-700 text-center">
            <p className="text-sm">
              © {new Date().getFullYear()} Anandam Multi-Speciality Hospitals.
              All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
