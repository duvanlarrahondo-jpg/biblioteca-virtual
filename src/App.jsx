import React, { useState, useEffect } from "react";
import NavBar from "./components/NavBar.jsx";
import Home from "./views/Home.jsx";
import Cart from "./views/Cart.jsx";
import Notes from "./views/Notes.jsx";

const initialBooks = [
  {
    id: 1,
    titulo: "Cien años de soledad",
    autor: "Gabriel García Márquez",
    precio: 45000,
    paginas: 417,
    imagen: "/images/cien-anos.jpeg",
  },
  {
    id: 2,
    titulo: "El amor en los tiempos del cólera",
    autor: "Gabriel García Márquez",
    precio: 42000,
    paginas: 480,
    imagen: "/images/amor-en-los-tiempos.png",
  },
  {
    id: 3,
    titulo: "La ciudad y los perros",
    autor: "Mario Vargas Llosa",
    precio: 38000,
    paginas: 376,
    imagen: "/images/ciudad-perros.jpg",
  },
  {
    id: 4,
    titulo: "Rayuela",
    autor: "Julio Cortázar",
    precio: 50000,
    paginas: 736,
    imagen: "/images/rayuela.png",
  },
  {
    id: 5,
    titulo: "Ficciones",
    autor: "Jorge Luis Borges",
    precio: 36000,
    paginas: 224,
    imagen: "/images/ficciones.jpg",
  },
  {
    id: 6,
    titulo: "La casa de los espíritus",
    autor: "Isabel Allende",
    precio: 44000,
    paginas: 490,
    imagen: "/images/casa-espiritus.jpeg",
  },
  // +6 libros nuevos
  {
    id: 7,
    titulo: "Pedro Páramo",
    autor: "Juan Rulfo",
    precio: 30000,
    paginas: 124,
    imagen: "/images/pedro-paramo.jpeg",
  },
  {
    id: 8,
    titulo: "Don Quijote de la Mancha",
    autor: "Miguel de Cervantes",
    precio: 62000,
    paginas: 930,
    imagen: "/images/don-quijote.jpeg",
  },
  {
    id: 9,
    titulo: "El Aleph",
    autor: "Jorge Luis Borges",
    precio: 28000,
    paginas: 160,
    imagen: "/images/el-aleph.jpeg",
  },
  {
    id: 10,
    titulo: "Crónica de una muerte anunciada",
    autor: "Gabriel García Márquez",
    precio: 22000,
    paginas: 120,
    imagen: "/images/cronica-muerte.jpeg",
  },
  {
    id: 11,
    titulo: "Los detectives salvajes",
    autor: "Roberto Bolaño",
    precio: 55000,
    paginas: 600,
    imagen: "/images/detectives-salvajes.jpeg",
  },
  {
    id: 12,
    titulo: "La tregua",
    autor: "Mario Benedetti",
    precio: 26000,
    paginas: 240,
    imagen: "/images/la-tregua.jpeg",
  },
];

function formatCOP(n) {
  try {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(n || 0);
  } catch {
    return `${n} COP`;
  }
}

// helper para cargar seguro desde localStorage
function loadState(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [section, setSection] = useState("inicio"); // "inicio" | "carrito" | "notas"
  const [books] = useState(initialBooks);

  // Cargar estados persistidos (si existen)
  const [cart, setCart] = useState(() => loadState("biblioteca_cart", []));
  const [orders, setOrders] = useState(() => loadState("biblioteca_orders", []));
  const [notes, setNotes] = useState(() => loadState("biblioteca_notes", []));

  // Guardar en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem("biblioteca_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("biblioteca_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("biblioteca_notes", JSON.stringify(notes));
  }, [notes]);

  return (
    <div className="container">
      <header className="header">
        <div className="brand">
          <div className="logo" />
          <div>
            <div style={{ fontSize: 18, lineHeight: 1 }}>Biblioteca Virtual</div>
            <div className="small">React + Estado en tiempo real (useState)</div>
          </div>
        </div>

        <NavBar active={section} onChange={setSection} />
      </header>

      {section === "inicio" && <Home />}

      {section === "carrito" && (
        <Cart
          books={books}
          cart={cart}
          setCart={setCart}
          orders={orders}
          setOrders={setOrders}
          formatCOP={formatCOP}
        />
      )}

      {section === "notas" && <Notes notes={notes} setNotes={setNotes} />}
    </div>
  );
}
