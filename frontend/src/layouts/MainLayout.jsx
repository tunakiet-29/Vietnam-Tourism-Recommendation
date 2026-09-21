import { Link, Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div>
      <header>
        <nav>
          <Link to="/">Vietnam Travel</Link>

          <div>
            <Link to="/">Home</Link>
            <Link to="/explore">Explore</Link>
            <Link to="/recommendations">Recommendations</Link>
            <Link to="/bookings">My Bookings</Link>
            <Link to="/profile">Profile</Link>
          </div>

          <div>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;