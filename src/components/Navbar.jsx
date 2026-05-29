import { Link } from "react-router-dom";

function Navbar() {
    const logout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <div className="brand-logo">EMS</div>

                <div>
                    <h3>Employee Management System</h3>
                    <p>Admin Dashboard</p>
                </div>
            </div>

            <div className="nav-links">
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/employees">Employees</Link>
            </div>

            <div className="nav-actions">
                <span className="user-badge">Admin</span>

                <button className="logout-btn" onClick={logout}>
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;