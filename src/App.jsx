import { BrowserRouter, Routes, Route } from "react-router-dom";

import Discover from "./pages/Discover";
import Saved from "./pages/Saved";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import InfluencerDashboard from "./pages/InfluencerDashboard";
import Login from "./pages/Login";
import InfluencerRegister from "./pages/InfluencerRegister"; // ✅ ADDED

import Navbar from "./components/Navbar";
import RequireRole from "./components/RequireRole";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<Discover />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route
          path="/influencer-register"
          element={<InfluencerRegister />}
        />

        {/* ================= BRAND ================= */}
        <Route path="/saved" element={<Saved />} />

        <Route
          path="/orders"
          element={
            <RequireRole role="brand">
              <Orders />
            </RequireRole>
          }
        />

        {/* ================= INFLUENCER ================= */}
        <Route
          path="/influencer"
          element={
            <RequireRole role="influencer">
              <InfluencerDashboard />
            </RequireRole>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
