export default function Home() {
  const noticias = [
    {
      id: 1,
      titulo: "Nueva colección de literatura latinoamericana",
      cuerpo:
        "Llegaron 120 títulos nuevos; destacamos a García Márquez, Borges y Allende. Pide tu préstamo desde la app.",
      etiqueta: "Novedad",
    },
    {
      id: 2,
      titulo: "Club de lectura — Viernes 6:00 p.m.",
      cuerpo:
        "Esta semana leemos cuentos de Julio Cortázar. Inscripción gratuita en el mostrador.",
      etiqueta: "Evento",
    },
    {
      id: 3,
      titulo: "Horario extendido de exámenes",
      cuerpo:
        "Del 2 al 15 se extiende el horario hasta las 9:00 p.m. ¡Aprovecha las salas de estudio!",
      etiqueta: "Aviso",
    },
  ];

  return (
    <div className="section">
      <h2 style={{ marginTop: 0 }}>Noticias de la Biblioteca</h2>
      <p className="small" style={{ marginTop: 4 }}>
        Mantente al día con nuestras novedades y actividades 📚
      </p>

      <div className="grid cols-3" style={{ marginTop: 12 }}>
        {noticias.map((n) => (
          <article key={n.id} className="card">
            <div className="body">
              <span className="badge">{n.etiqueta}</span>
              <h3 className="title">{n.titulo}</h3>
              <p style={{ marginTop: 8, lineHeight: 1.5 }}>{n.cuerpo}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
