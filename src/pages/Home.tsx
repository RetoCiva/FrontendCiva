import { useNavigate } from "react-router-dom";

export default function Home(){
  const nav = useNavigate();
  const logout = () => { localStorage.removeItem("token"); nav("/login", {replace:true}); };

  return (
    <div style={{maxWidth:900, margin:"40px auto"}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <h2>Home</h2>
        <button onClick={logout}>Salir</button>
      </div>

      {/* aquí irán tus cards: agregar bus / ver todos / buscar por ID */}
      <div style={{display:"grid", gap:16, gridTemplateColumns:"repeat(auto-fit, minmax(240px,1fr))"}}>
        <div style={{padding:16, border:"1px solid #eee", borderRadius:12}}>Agregar bus</div>
        <div style={{padding:16, border:"1px solid #eee", borderRadius:12}}>Ver todos (tabla)</div>
        <div style={{padding:16, border:"1px solid #eee", borderRadius:12}}>Buscar por ID</div>
      </div>
    </div>
  );
}
