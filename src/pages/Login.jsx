import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/client";

function Login() {
  const navigate = useNavigate();

  // ✅ NEW: Auto-redirect if already logged in (SAFE)
  useEffect(() => {
    const token = localStorage.getItem("auth_token") || localStorage.getItem("access_token");
    const role = localStorage.getItem("auth_role");

    if (token && role) {
      if (role === "brand") {
        navigate("/orders", { replace: true });
      } else if (role === "influencer") {
        navigate("/influencer", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // ✅ Persist auth
      localStorage.setItem("auth_token", res.access_token);
      localStorage.setItem("auth_role", res.role);

      // ✅ Role-based redirect
      if (res.role === "brand") {
        navigate("/orders", { replace: true });
      } else if (res.role === "influencer") {
        navigate("/influencer", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div
      style={{
        maxWidth: 420,
        margin: "120px auto",
        padding: 32,
        background: "#fff",
        borderRadius: 18,
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
      }}
    >
      <h2 style={{ marginBottom: 20 }}>Login</h2>

      {error && (
        <p style={{ color: "#e11d48", marginBottom: 12 }}>
          {error}
        </p>
      )}

      <form onSubmit={onSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>
          Login
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  marginBottom: 14,
  borderRadius: 10,
  border: "1px solid #ddd",
  fontSize: 14,
};

const buttonStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 10,
  border: "none",
  background: "#111",
  color: "#fff",
  fontSize: 15,
  cursor: "pointer",
};

export default Login;
