import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Explore from "./pages/Explore";
import TourDetail from "./pages/TourDetail";
import Recommendations from "./pages/Recommendations";
import Bookings from "./pages/Bookings";
import Profile from "./pages/Profile";
import PaymentResult from "./pages/PaymentResult";
import AdminBookings from "./pages/AdminBookings";
import NotFound from "./pages/NotFound";
import AdminTours from "./pages/AdminTours";
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
        <Route path="/payment/result" element={<PaymentResult />} />

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

          <Route element={<AdminRoute />}>
            <Route
              path="/admin/bookings"
              element={<AdminBookings />}
            />
          </Route>
        </Route>

        <Route
            path="/admin/tours"
            element={<AdminTours />}
        />

        <Route
            path="/admin/bookings"
            element={<AdminBookings />}
        />
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
