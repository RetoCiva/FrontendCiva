import { useState } from "react";
import { api } from "../api";
import { Link, useNavigate } from "react-router-dom";

export default function Login(){
  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try{
      setLoading(true); setError("");

      if (!username.includes("@")) throw new Error("Correo inválido");
      if (password.length < 6) throw new Error("La contraseña debe tener al menos 6 caracteres");

      const { token } = await api.signIn({ username, password });
      if (!token) throw new Error("No se recibió token");
      localStorage.setItem("token", token);
      nav("/", { replace:true });
    }catch(err:any){
      setError(err.message || "Error al iniciar sesión");
    }finally{ setLoading(false); }
  };

    return (
    <>
        <div className="center">
        <div className="card" style={{ width: 380 }}>
            <h2 style={{ textAlign: "center" }}>Iniciar sesión</h2>
            <p className="kicker" style={{ textAlign: "center" }}>
            Accede con tu correo y contraseña
            </p>

            <form
            onSubmit={submit}
            style={{
                maxWidth: 420,
                width: "100%",
                display: "grid",
                gap: 12,
                justifyItems: "stretch", 
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

            {error && (
                <div className="helper" style={{ color: "#ff9b9b", textAlign: "center" }}>
                {error}
                </div>
            )}

            <div
                style={{
                display: "flex",
                gap: 10,
                marginTop: 8,
                justifyContent: "center",
                }}
            >
                <button disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
                </button>
                <Link to="/register">
                <button type="button" className="secondary">
                    Crear cuenta
                </button>
                </Link>
            </div>
            </form>
        </div>
        </div>
    </>
    );
}
