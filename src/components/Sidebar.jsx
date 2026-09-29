import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">MENU</h2>

      <nav className="sidebar-nav">
        <NavLink to="/" className="nav-link">
          Dashboard
        </NavLink>

        <NavLink to="/rooms" className="nav-link">
          Rooms
        </NavLink>

        <NavLink to="/customers" className="nav-link">
          Customers
        </NavLink>

        <NavLink to="/bookings" className="nav-link">
          Bookings
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;