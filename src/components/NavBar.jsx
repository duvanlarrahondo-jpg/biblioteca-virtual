export default function NavBar({ active, onChange }) {
  return (
    <nav className="nav">
      <button
        className={`btn ${active === "inicio" ? "active" : ""}`}
        onClick={() => onChange("inicio")}
      >
        🏠 Inicio
      </button>
      <button
        className={`btn ${active === "carrito" ? "active" : ""}`}
        onClick={() => onChange("carrito")}
      >
        🛒 Carrito de Libros
      </button>
      <button
        className={`btn ${active === "notas" ? "active" : ""}`}
        onClick={() => onChange("notas")}
      >
        📓 Notas
      </button>
    </nav>
  );
}
