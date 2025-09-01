import { useMemo, useState } from "react";

export default function Cart({ books, cart, setCart, orders, setOrders, formatCOP }) {
  const [tab, setTab] = useState("actual"); // "actual" | "historial"

  // --- filtros y buscador
  const [search, setSearch] = useState("");
  const [authorFilter, setAuthorFilter] = useState("todos");
  const [pagesFilter, setPagesFilter] = useState("all"); // all | lt200 | 200-400 | gt400

  const authors = useMemo(
    () => ["todos", ...Array.from(new Set(books.map((b) => b.autor)))],
    [books]
  );

  const filteredBooks = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    return books.filter((b) => {
      if (q) {
        const inText =
          b.titulo.toLowerCase().includes(q) ||
          b.autor.toLowerCase().includes(q);
        if (!inText) return false;
      }
      if (authorFilter !== "todos" && b.autor !== authorFilter) return false;
      if (pagesFilter === "lt200" && !(b.paginas <= 200)) return false;
      if (pagesFilter === "200-400" && !(b.paginas > 200 && b.paginas <= 400)) return false;
      if (pagesFilter === "gt400" && !(b.paginas > 400)) return false;
      return true;
    });
  }, [books, search, authorFilter, pagesFilter]);

  // Detalle del carrito con info de libro
  const cartDetailed = useMemo(
    () =>
      cart.map((item) => {
        const book = books.find((b) => b.id === item.id);
        return { ...item, book, subtotal: (book?.precio || 0) * item.qty };
      }),
    [cart, books]
  );

  const total = useMemo(
    () => cartDetailed.reduce((acc, it) => acc + it.subtotal, 0),
    [cartDetailed]
  );

  function addToCart(id) {
    setTab("actual");
    setCart((prev) => {
      const found = prev.find((p) => p.id === id);
      if (found) {
        return prev.map((p) => (p.id === id ? { ...p, qty: p.qty + 1 } : p));
      }
      return [...prev, { id, qty: 1 }];
    });
  }

  function removeFromCart(id) {
    setCart((prev) => prev.filter((p) => p.id !== id));
  }

  function changeQty(id, delta) {
    setCart((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, qty: Math.max(1, p.qty + delta) } : p))
        .filter((p) => p.qty > 0)
    );
  }

  function finalizeOrder() {
    if (!cartDetailed.length) return;
    const fecha = new Date();
    const order = {
      id: Date.now(),
      fecha: fecha.toLocaleString("es-CO"),
      items: cartDetailed.map((it) => ({
        id: it.id,
        titulo: it.book?.titulo,
        autor: it.book?.autor,
        paginas: it.book?.paginas,
        precio: it.book?.precio,
        qty: it.qty,
        subtotal: it.subtotal,
      })),
      total,
    };
    setOrders((prev) => [order, ...prev]);
    setCart([]);
    setTab("historial");
  }

  return (
    <div className="section">
      <h2 style={{ marginTop: 0 }}>Carrito de Libros</h2>
      <p className="small">Explora el catálogo, agrega libros y finaliza tu compra.</p>

      {/* buscador y filtros */}
      <div style={{ display: "flex", gap: 10, marginTop: 12, alignItems: "center", flexWrap: "wrap" }}>
        <input
          className="input"
          placeholder="Buscar por título o autor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200 }}
        />
        <select className="select" value={authorFilter} onChange={(e) => setAuthorFilter(e.target.value)}>
          {authors.map((a) => (
            <option key={a} value={a}>
              {a === "todos" ? "Todos los autores" : a}
            </option>
          ))}
        </select>
        <select className="select" value={pagesFilter} onChange={(e) => setPagesFilter(e.target.value)}>
          <option value="all">Todas las páginas</option>
          <option value="lt200">≤ 200 págs</option>
          <option value="200-400">201 - 400 págs</option>
          <option value="gt400"> 400 págs</option>
        </select>
        <button
          className="btn ghost"
          onClick={() => {
            setSearch("");
            setAuthorFilter("todos");
            setPagesFilter("all");
          }}
        >
          Limpiar filtros
        </button>
      </div>

      {/* Catálogo */}
      <h3 style={{ marginTop: 18, marginBottom: 8 }}>Catálogo</h3>
      <div className="grid cols-3">
        {filteredBooks.map((b) => (
          <div key={b.id} className="card">
            <div className="media">
              <img src={b.imagen} alt={b.titulo} />
            </div>
            <div className="body">
              <div className="row" style={{ justifyContent: "space-between" }}>
                <span className="badge">{b.autor}</span>
                <span className="badge">{b.paginas} págs</span>
              </div>
              <h4 className="title">{b.titulo}</h4>
              <p className="meta">{formatCOP(b.precio)}</p>
              <div className="actions" style={{ marginTop: 8 }}>
                <button className="btn primary" onClick={() => addToCart(b.id)}>
                  ➕ Agregar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mini menú: carrito actual vs historial */}
      <div style={{ marginTop: 18 }}>
        <div className="tabbar">
          <button className={`tab ${tab === "actual" ? "active" : ""}`} onClick={() => setTab("actual")}>
            Carrito actual
          </button>
          <button className={`tab ${tab === "historial" ? "active" : ""}`} onClick={() => setTab("historial")}>
            Compras realizadas
          </button>
        </div>

        {tab === "actual" ? (
          <div className="card">
            <div className="body">
              <h4 className="title">Resumen del carrito</h4>
              {cartDetailed.length === 0 ? (
                <p className="small">No hay libros en el carrito todavía.</p>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Libro</th>
                      <th>Precio</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartDetailed.map((it) => (
                      <tr key={it.id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span className="badge">{it.book?.autor}</span>
                            <div>{it.book?.titulo}</div>
                          </div>
                        </td>
                        <td>{formatCOP(it.book?.precio || 0)}</td>
                        <td>
                          <div className="row">
                            <button className="btn" onClick={() => changeQty(it.id, -1)}>−</button>
                            <span className="kbd">{it.qty}</span>
                            <button className="btn" onClick={() => changeQty(it.id, +1)}>+</button>
                          </div>
                        </td>
                        <td>{formatCOP(it.subtotal)}</td>
                        <td>
                          <button className="btn danger" onClick={() => removeFromCart(it.id)}>Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" style={{ textAlign: "right" }}>Total</td>
                      <td>{formatCOP(total)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              )}
              <div className="actions" style={{ marginTop: 10 }}>
                <button
                  className="btn success"
                  disabled={!cartDetailed.length}
                  onClick={finalizeOrder}
                >
                  ✅ Finalizar compra
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="body">
              <h4 className="title">Historial de compras</h4>
              {orders.length === 0 ? (
                <p className="small">Aún no hay compras finalizadas.</p>
              ) : (
                <div className="grid">
                  {orders.map((o) => (
                    <div key={o.id} className="card">
                      <div className="body">
                        <div className="row" style={{ justifyContent: "space-between" }}>
                          <div className="badge">Orden #{o.id}</div>
                          <div className="badge">{o.fecha}</div>
                        </div>
                        <table className="table" style={{ marginTop: 8 }}>
                          <thead>
                            <tr>
                              <th>Libro</th>
                              <th>Precio</th>
                              <th>Cant.</th>
                              <th>Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {o.items.map((it) => (
                              <tr key={it.id}>
                                <td>
                                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                                    <span className="badge">{it.autor}</span>
                                    <div>{it.titulo}</div>
                                  </div>
                                </td>
                                <td>{formatCOP(it.precio)}</td>
                                <td>{it.qty}</td>
                                <td>{formatCOP(it.subtotal)}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td colSpan="3" style={{ textAlign: "right" }}>Total</td>
                              <td>{formatCOP(o.total)}</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
