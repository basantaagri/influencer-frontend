import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/client";

function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await apiFetch("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // Optional: auto-login after signup
      if (res?.access_token) {
        localStorage.setItem("access_token", res.access_token);
        localStorage.setItem("auth_role", res.role || "brand");
        navigate("/", { replace: true });
      } else {
        navigate("/login");
      }
    } catch (err) {
      setError("Signup failed");
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
      <h2 style={{ marginBottom: 20 }}>Create account</h2>

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
          Sign Up
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

export default Signup;
