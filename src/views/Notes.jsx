import { useState } from "react";

export default function Notes({ notes, setNotes }) {
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  function addNote(e) {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    const n = {
      id: Date.now(),
      text: t,
      createdAt: new Date().toLocaleString("es-CO"),
    };
    setNotes((prev) => [n, ...prev]);
    setText("");
  }

  function startEdit(id, currentText) {
    setEditingId(id);
    setEditingText(currentText);
  }

  function saveEdit(id) {
    const t = editingText.trim();
    if (!t) return;
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, text: t } : n)));
    setEditingId(null);
    setEditingText("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingText("");
  }

  function removeNote(id) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <div className="section">
      <h2 style={{ marginTop: 0 }}>Notas del lector</h2>
      <form onSubmit={addNote} className="row" style={{ marginTop: 8 }}>
        <input
          className="input"
          placeholder="Escribe una nota corta (ej. 'Recordar devolver Cien años de soledad')"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="btn primary" type="submit">Agregar nota</button>
      </form>

      <div className="grid" style={{ marginTop: 14 }}>
        {notes.length === 0 ? (
          <p className="small">Aún no hay notas.</p>
        ) : (
          notes.map((n) => (
            <div key={n.id} className="card">
              <div className="body">
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <span className="badge">{n.createdAt}</span>
                </div>

                {editingId === n.id ? (
                  <>
                    <textarea
                      className="textarea"
                      rows="3"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      style={{ marginTop: 8 }}
                    />
                    <div className="actions" style={{ marginTop: 8 }}>
                      <button className="btn success" onClick={() => saveEdit(n.id)}>Guardar</button>
                      <button className="btn" onClick={cancelEdit} type="button">Cancelar</button>
                    </div>
                  </>
                ) : (
                  <>
                    <p style={{ marginTop: 10, lineHeight: 1.5 }}>{n.text}</p>
                    <div className="actions" style={{ marginTop: 8 }}>
                      <button className="btn" onClick={() => startEdit(n.id, n.text)}>Editar</button>
                      <button className="btn danger" onClick={() => removeNote(n.id)}>Eliminar</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
