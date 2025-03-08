import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Call logout function from AuthContext
    navigate("/login"); // Redirect to login page
  };

  return (
    <nav className="flex justify-between items-center p-6 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
      {/* Left Side: Logo */}
      <div className="flex items-center space-x-3">
        <span className="text-2xl font-extrabold text-white tracking-wide">
          <Link to="/">🏥 Integrated Hospital</Link>
        </span>
      </div>

      {/* Right Side: Buttons */}
      <div className="space-x-4">
        {user ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:bg-red-700 transition-transform hover:scale-105"
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-green-500 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:bg-green-700 transition-transform hover:scale-105"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-yellow-500 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:bg-yellow-600 transition-transform hover:scale-105"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}


export default Navbar ;
