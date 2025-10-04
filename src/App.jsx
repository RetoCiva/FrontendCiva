import { Outlet, Link, useLocation } from "react-router-dom";

export default function App() {
  const location = useLocation();
  const isAuthPage = ["/login", "/register"].includes(location.pathname);
  const logout = () => { localStorage.removeItem("token"); nav("/login", {replace:true}); };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0f0f17, #141422)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header con logo CIVA */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: isAuthPage ? "center" : "space-between",
          padding: "16px 32px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          color: "#fff",
          fontWeight: "bold",
        }}
      >
        <span style={{ fontSize: "1.2rem", letterSpacing: "2px" }}>CIVA</span>

        {!isAuthPage && (
          <nav style={{ display: "flex", gap: "16px" }}>
            <button onClick={logout}>Cerrar Sesión</button>
          </nav>
        )}
      </header>

      {/* Contenido centrado */}
      <main
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
