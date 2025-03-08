import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const { login, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    loginId: "", // Changed from userName to loginId
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData.loginId, formData.password); // Changed from userName to loginId
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-6">Login Page</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Login ID</label>{" "}
          {/* Updated label for clarity */}
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={formData.loginId} // Changed from userName to loginId
            onChange={
              (e) => setFormData({ ...formData, loginId: e.target.value }) // Changed from userName to loginId
            }
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
