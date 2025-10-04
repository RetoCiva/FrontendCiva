import { useState } from "react";
import { useEffect } from "react";

export default function Home() {
  const [selected, setSelected] = useState("none");

  const renderContent = () => {
    switch (selected) {
      case "add":
          return <AddBusForm />;
      case "list":
        return <BusesTable />;
      case "search":
          return <SearchBus />;
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

type Bus = {
  id?: number;
  busNumber: number;
  characteristics: string;
  plate: string;
  model?: string;
  busBrand: string;
  status: number;
};

function BusesTable() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchBuses() {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("http://localhost:8080/api/v1/bus", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setBuses(data);
    } catch (err) {
      console.error(err);
      setError("❌ No se pudieron cargar los buses.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBuses();
  }, []);

  if (loading) return <p>Cargando buses...</p>;
  if (error) return <p style={{ color: "#ff9b9b" }}>{error}</p>;

  if (!buses.length)
    return <p style={{ color: "#aaa" }}>No hay buses registrados.</p>;

  return (
    <div style={{ overflowX: "auto" }}>
      <h3 style={{ marginBottom: 12 }}>📋 Lista de Buses</h3>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          color: "#fff",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <thead>
          <tr
            style={{
              background: "linear-gradient(90deg, #6b21a8, #a855f7)",
              textAlign: "left",
            }}
          >
            <th style={{ padding: 10 }}>#</th>
            <th style={{ padding: 10 }}>N° Bus</th>
            <th style={{ padding: 10 }}>Características</th>
            <th style={{ padding: 10 }}>Placa</th>
            <th style={{ padding: 10 }}>Modelo</th>
            <th style={{ padding: 10 }}>Marca</th>
            <th style={{ padding: 10 }}>Estado</th>
          </tr>
        </thead>

        <tbody>
          {buses.map((bus, i) => (
            <tr
              key={bus.id || i}
              style={{
                background:
                  i % 2 === 0
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(255,255,255,0.05)",
              }}
            >
              <td style={{ padding: 10 }}>{i + 1}</td>
              <td style={{ padding: 10 }}>{bus.busNumber}</td>
              <td style={{ padding: 10 }}>{bus.characteristics}</td>
              <td style={{ padding: 10 }}>{bus.plate}</td>
              <td style={{ padding: 10 }}>{bus.model ?? "-"}</td>
              <td style={{ padding: 10 }}>{bus.busBrand}</td>
              <td
                style={{
                  padding: 10,
                  color: bus.status === 1 ? "#7ef0c4" : "#ff9b9b",
                  fontWeight: 600,
                }}
              >
                {bus.status === 1 ? "Activo" : "Inactivo"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SearchBus() {
  const [busId, setBusId] = useState("");
  const [bus, setBus] = useState<Bus | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: { preventDefault: () => void; }) {
    e.preventDefault();
    setError("");
    setBus(null);

    if (!busId.trim()) {
      setError("⚠️ Ingresa un ID para buscar.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8080/api/v1/bus/${busId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.status === 404) {
        setError("❌ No se encontró ningún bus con ese ID.");
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setBus(data);
    } catch (err) {
      console.error(err);
      setError("❌ Error al buscar el bus. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 500 }}>
      <h3>🔍 Buscar Bus por ID</h3>
      <form
        onSubmit={handleSearch}
        style={{ display: "flex", gap: 10, marginBottom: 20 }}
      >
        <input
          type="number"
          placeholder="Ej: 1"
          value={busId}
          onChange={(e) => setBusId(e.target.value)}
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            background:
              "linear-gradient(180deg, #6b21a8, #a855f7)",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {error && <p style={{ color: "#ff9b9b" }}>{error}</p>}

      {bus && (
        <div
          style={{
            marginTop: 16,
            padding: 16,
            borderRadius: 12,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <h4 style={{ marginBottom: 8 }}>🚌 Bus encontrado</h4>
          <p><b>ID:</b> {bus.id}</p>
          <p><b>N° Bus:</b> {bus.busNumber}</p>
          <p><b>Características:</b> {bus.characteristics}</p>
          <p><b>Placa:</b> {bus.plate}</p>
          <p><b>Marca:</b> {bus.busBrand}</p>
          <p>
            <b>Estado:</b>{" "}
            <span
              style={{
                color: bus.status === 1 ? "#7ef0c4" : "#ff9b9b",
                fontWeight: 600,
              }}
            >
              {bus.status === 1 ? "Activo" : "Inactivo"}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
