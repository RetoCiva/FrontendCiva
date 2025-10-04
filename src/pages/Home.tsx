import { useState } from "react";

export default function Home() {
  const [selected, setSelected] = useState("none");

  const renderContent = () => {
    switch (selected) {
      case "add":
          return <AddBusForm />;
      case "list":
        return (
          <div>
            <h3>📋 Ver todos (tabla)</h3>
            <p style={{ color: "#aaa" }}>
              Aquí se mostrará la tabla con todos los buses registrados.
            </p>
          </div>
        );
      case "search":
        return (
          <div>
            <h3>🔍 Buscar por ID</h3>
            <p style={{ color: "#aaa" }}>
              Aquí podrás buscar un bus por su identificador único.
            </p>
          </div>
        );
      default:
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              color: "#777",
            }}
          >
            Selecciona una opción del menú para empezar
          </div>
        );
    }
  };

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

        <NavItem
          text="➕ Agregar bus"
          active={selected === "add"}
          onClick={() => setSelected("add")}
        />
        <NavItem
          text="📋 Ver todos (tabla)"
          active={selected === "list"}
          onClick={() => setSelected("list")}
        />
        <NavItem
          text="🔍 Buscar por ID"
          active={selected === "search"}
          onClick={() => setSelected("search")}
        />
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
        {renderContent()}
      </section>
    </div>
  );
}

type NavItemProps = {
  text: string;
  active: boolean;
  onClick: () => void;
};

function NavItem({ text, active, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "block",
        textAlign: "left",
        width: "100%",
        padding: "14px 18px",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.2)",
        background: active
          ? "linear-gradient(180deg, #6b21a8, #a855f7)"
          : "transparent",
        color: "#fff",
        fontWeight: 500,
        cursor: "pointer",
        transition: "0.2s ease",
      }}
    >
      {text}
    </button>
  );
}


function AddBusForm() {
  const [form, setForm] = useState({
    busNumber: "",
    characteristics: "",
    plate: "",
    status: "1",
    busBrand: "VOLVO",
  });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePlate = (p: string) => /^[A-Z0-9]{6}$/i.test(p);

  async function handleSubmit(e: { preventDefault: () => void; }) {
    e.preventDefault();
    setMsg("");
    setError("");

    if (!validatePlate(form.plate)) {
      setError("❌ La placa debe tener exactamente 6 caracteres alfanuméricos.");
      return;
    }

    if (!["VOLVO", "FIAT", "SCANIA"].includes(form.busBrand)) {
      setError("❌ La marca debe ser VOLVO, FIAT o SCANIA.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/v1/bus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          busNumber: Number(form.busNumber),
          characteristics: form.characteristics,
          plate: form.plate.toUpperCase(),
          status: Number(form.status),
          busBrand: form.busBrand.toUpperCase(),
        }),
      });

      if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
      setMsg("✅ Bus registrado correctamente.");
      setForm({
        busNumber: "",
        characteristics: "",
        plate: "",
        status: "1",
        busBrand: "VOLVO",
      });
    } catch (err) {
      setError("❌ No se pudo registrar el bus. Verifica los datos.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 500 }}>
      <h3 style={{ marginBottom: 16 }}>➕ Agregar Bus</h3>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        <label>
          Número de Bus:
          <input
            type="number"
            value={form.busNumber}
            onChange={(e) => setForm({ ...form, busNumber: e.target.value })}
            required
          />
        </label>

        <label>
          Características:
          <input
            type="text"
            value={form.characteristics}
            onChange={(e) =>
              setForm({ ...form, characteristics: e.target.value })
            }
            required
          />
        </label>

        <label>
          Placa:
          <input
            type="text"
            value={form.plate}
            onChange={(e) => setForm({ ...form, plate: e.target.value })}
            maxLength={6}
            placeholder="Ej: ABC123"
            required
          />
        </label>

        <label>
          Marca:
          <select
            value={form.busBrand}
            onChange={(e) => setForm({ ...form, busBrand: e.target.value })}
          >
            <option value="VOLVO">VOLVO</option>
            <option value="FIAT">FIAT</option>
            <option value="SCANIA">SCANIA</option>
          </select>
        </label>

        <label>
          Estado:
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="1">Activo</option>
            <option value="0">Inactivo</option>
          </select>
        </label>

        {msg && <p style={{ color: "#7ef0c4" }}>{msg}</p>}
        {error && <p style={{ color: "#ff9b9b" }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{
            background:
              "linear-gradient(180deg, #6b21a8, #a855f7)",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          {loading ? "Registrando..." : "Registrar Bus"}
        </button>
      </form>
    </div>
  );
}
