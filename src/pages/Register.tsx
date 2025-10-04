import { useState } from "react";
import { api } from "../api";
import { Link, useNavigate } from "react-router-dom";

export default function Register(){
  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false);
  const [msg,setMsg] = useState("");
  const [error,setError] = useState("");
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try{
      setLoading(true); setError(""); setMsg("");

      if (!username.includes("@")) throw new Error("Correo inválido");
      if (password.length < 6) throw new Error("La contraseña debe tener al menos 6 caracteres");

      const res = await api.signUp({ username, password });

      if (res.token) {
        localStorage.setItem("token", res.token);
        nav("/", { replace:true });
        return;
      }

      setMsg("Cuenta creada. Ahora inicia sesión.");
      setTimeout(()=> nav("/login", {replace:true}), 800);
    }catch(err:any){
      setError(err.message || "Error al registrarse");
    }finally{ setLoading(false); }
  };

  return (
    <>
        <div className="center">
        <div className="card" style={{ width: 420 }}>
            {/* Título y subtítulo centrados */}
            <h2 style={{ textAlign: "center" }}>Crear cuenta</h2>
            <p className="kicker" style={{ textAlign: "center" }}>
            Solo tu correo y una contraseña
            </p>

            <form
            onSubmit={submit}
            style={{
                maxWidth: 420,
                width: "100%",
                display: "grid",
                gap: 12,
                justifyItems: "stretch", // inputs ocupan todo el ancho
            }}
            >
            <div>
                <label style={{ display: "block", textAlign: "center", marginBottom: 6 }}>
                Correo
                </label>
                <input
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ width: "100%" }}
                />
            </div>

            <div>
                <label style={{ display: "block", textAlign: "center", marginBottom: 6 }}>
                Contraseña
                </label>
                <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: "100%" }}
                />
            </div>

            {/* Mensajes centrados */}
            {msg && (
                <div className="helper" style={{ color: "#7ef0c4", textAlign: "center" }}>
                {msg}
                </div>
            )}
            {error && (
                <div className="helper" style={{ color: "#ff9b9b", textAlign: "center" }}>
                {error}
                </div>
            )}

            {/* Botones centrados */}
            <div
                style={{
                display: "flex",
                gap: 10,
                marginTop: 8,
                justifyContent: "center",
                }}
            >
                <button disabled={loading}>
                {loading ? "Creando..." : "Registrarme"}
                </button>
                <Link to="/login">
                <button type="button" className="secondary">Ya tengo cuenta</button>
                </Link>
            </div>
            </form>
        </div>
        </div>
    </>
    );
}
