import { NavLink, useNavigate } from "react-router-dom";
import { api } from "../api";
import {
  User,
  Bell,
  LogOut,
  Plus,
  Search,
  Home
} from "lucide-react";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    api.auth.logout();
    setIsLoggedIn(false);
    navigate("/login");
    window.location.reload();
  };

  return (
    <header className="navbar">

      <div className="nav-left">
        {isLoggedIn && (
        <NavLink to="/profile" className="nav-item">
          <User size={18} />
          <span>Profile</span>
        </NavLink>
        )}
      </div>

      <div className="nav-center">
      </div>

      <div className="nav-right">
        {isLoggedIn && (
            <>
        <NavLink to="/" className="nav-item">
          <Home size={18} />
        </NavLink>

        <NavLink to="/search" className="nav-item">
          <Search size={18} />
          <span>Search</span>
        </NavLink>

        <NavLink to="/create-group" className="nav-item">
          <Plus size={18} />
          <span>Create Group</span>
        </NavLink>

        {user?.role !== "tutor" && (
              <NavLink to="/become-tutor" className="nav-item">
                <span>Become Tutor</span>
              </NavLink>
            )}

        <NavLink to="/notifications" className="nav-item">
          <Bell size={18} />
        </NavLink>

        {/* LOGOUT */}
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
        </>
        )}
        {!isLoggedIn && (
            <NavLink to="/login" className="nav-item">
                <span>Login</span>
            </NavLink>
        )}
      </div>

    </header>
  );
};


export default Navbar;
