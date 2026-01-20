import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function InfluencerRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    platform: "",
    profile_url: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1️⃣ Register influencer account
      const res = await fetch("http://127.0.0.1:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          role: "influencer", // 🔒 locked
        }),
      });

      if (!res.ok) throw new Error("Registration failed");

      // 2️⃣ (Future) You will attach profile_url → audit queue
      // For now, we redirect safely

      navigate("/login");
    } catch (err) {
      setError("Unable to create influencer account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Join as an Influencer</h2>
      <p className="muted">
        Get discovered based on real engagement, not fake followers.
      </p>

      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          onChange={handleChange}
        />

        <select
          name="platform"
          required
          onChange={handleChange}
        >
          <option value="">Select Platform</option>
          <option value="instagram">Instagram</option>
          <option value="youtube">YouTube</option>
          <option value="tiktok">TikTok</option>
        </select>

        <input
          name="profile_url"
          type="url"
          placeholder="Profile URL"
          required
          onChange={handleChange}
        />

        {error && <p className="error">{error}</p>}

        <button disabled={loading}>
          {loading ? "Creating account..." : "Create Influencer Account"}
        </button>
      </form>

      <p className="hint">
        After signup, your profile will be audited before brands can contact you.
      </p>
    </div>
  );
}
