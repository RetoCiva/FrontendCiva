import { NavLink, Outlet } from "react-router-dom";

export default function Home() {
  return (
    <div
      style={{
        display: "flex",
        gap: 20,
        height: "75vh",
        width: "min(95vw, 1100px)",
        margin: "40px auto",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: 260,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <h2 style={{ color: "#fff", marginBottom: 8 }}>Menú</h2>

        <NavItem to="add" text="➕ Agregar bus" />
        <NavItem to="list" text="📋 Ver todos (tabla)" />
        <NavItem to="search" text="🔍 Buscar por ID" />
      </aside>

      {/* Panel derecho */}
      <section
        style={{
          flex: 1,
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.15)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
          color: "#fff",
          padding: 24,
          overflow: "auto",
        }}
      >
        <Outlet />
      </section>
    </div>
  );
}

type NavItemProps = {
  to: string;
  text: string;
};

function NavItem({ to, text }: NavItemProps) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        display: "block",
        padding: "14px 18px",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.2)",
        background: isActive
          ? "linear-gradient(180deg, #6b21a8, #a855f7)"
          : "transparent",
        color: "#fff",
        textDecoration: "none",
        fontWeight: 500,
        transition: "0.2s ease",
      })}
    >
      {text}
    </NavLink>
  );
}
