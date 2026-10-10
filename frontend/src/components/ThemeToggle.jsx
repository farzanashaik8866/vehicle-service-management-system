import { useTheme } from "../context/ThemeContext";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="btn d-flex align-items-center justify-content-center gap-2"
      style={{
        backgroundColor: "var(--surface)",
        color: "var(--text)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        padding: "8px 14px",
        transition: "all 0.2s ease",
      }}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <span style={{ fontSize: "18px" }}>
        {theme === "light" ? "🌙" : "☀️"}
      </span>

      <span className="d-none d-sm-inline fw-semibold">
        {theme === "light" ? "Dark" : "Light"}
      </span>
    </button>
  );
}

export default ThemeToggle;
