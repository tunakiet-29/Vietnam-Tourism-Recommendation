import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Explore from "./pages/Explore";
import TourDetail from "./pages/TourDetail";
import Recommendations from "./pages/Recommendations";
import Bookings from "./pages/Bookings";
import Profile from "./pages/Profile";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/tours/:id" element={<TourDetail />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/recommendations"
            element={<Recommendations />}
          />

          <Route
            path="/bookings"
            element={<Bookings />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;