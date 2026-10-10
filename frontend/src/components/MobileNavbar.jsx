import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

function MobileNavbar({ setMobileOpen }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header className="mobile-navbar">
      <button
        type="button"
        className="mobile-menu-button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation"
      >
        ☰
      </button>

      <Logo size={36} showText={false} />

      <div className="mobile-navbar-actions">
        <ThemeToggle />

        <button
          type="button"
          className="mobile-user-button"
          onClick={logout}
          title="Logout"
        >
          👤
        </button>
      </div>
    </header>
  );
}

export default MobileNavbar;
