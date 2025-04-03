import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-[#404E7C] shadow-md">
      {/* Left Side: Logo */}
      <div className="flex items-center">
        <span className="text-xl font-semibold text-[#E8F6FC] tracking-wide">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🏥</span>
            <span className="text-2xl font-semibold">
              Anandam Multi-Speciality Hospital
            </span>
          </Link>
        </span>
      </div>

      {/* Center: Navigation Links (Added) */}
      <div className="hidden md:flex space-x-6"></div>

      {/* Right Side: Buttons */}
      <div>
        {user ? (
          <button
            onClick={handleLogout}
            className="bg-[#A5D8F3] text-[#404E7C] px-5 py-2 rounded font-medium hover:bg-[#8bc0e5] transition-all"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="bg-[#A5D8F3] text-[#404E7C] px-5 py-2 rounded font-medium hover:bg-[#8bc0e5] transition-all"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
