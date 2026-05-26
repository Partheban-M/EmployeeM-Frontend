function Navbar() {
    const logout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return (
        <nav>
            <h3>Employee App</h3>
            <button onClick={logout}>Logout</button>
        </nav>
    );
}

export default Navbar;