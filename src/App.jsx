import React from "react";

const games = [
  {
    sport: "NFL",
    match: "Chiefs vs Bills",
    pick: "Chiefs gana",
    confidence: "68%",
  },
  {
    sport: "NBA",
    match: "Lakers vs Celtics",
    pick: "Más de 219.5 puntos",
    confidence: "72%",
  },
  {
    sport: "SOCCER",
    match: "Inter Miami vs Orlando City",
    pick: "Ambos anotan",
    confidence: "64%",
  },
  {
    sport: "MLB",
    match: "Yankees vs Red Sox",
    pick: "Yankees gana",
    confidence: "61%",
  },
];

export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #04080f 0%, #0b1220 100%)",
        color: "white",
        fontFamily: "Arial, sans-serif",
        padding: "30px",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <header style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "48px", marginBottom: "10px" }}>Betai</h1>
          <p style={{ fontSize: "18px", opacity: 0.85 }}>
            Plataforma MVP de análisis deportivo
          </p>
        </header>

        <section
          style={{
            background: "#111827",
            border: "1px solid #1f2937",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "24px",
          }}
        >
          <h2 style={{ marginTop: 0 }}>🚀 Estado del proyecto</h2>
          <p>
            Betai ya está en línea. Ahora ya puede mostrar partidos de ejemplo
            y picks visuales por deporte.
          </p>
        </section>

        <section style={{ marginBottom: "24px" }}>
          <h2>🏆 Deportes incluidos</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "16px",
              marginTop: "16px",
            }}
          >
            {["NFL", "NBA", "SOCCER", "MLB"].map((sport) => (
              <div
                key={sport}
                style={{
                  background: "#1f2937",
                  padding: "20px",
                  borderRadius: "14px",
                  textAlign: "center",
                  border: "1px solid #374151",
                  fontWeight: "bold",
                  fontSize: "20px",
                }}
              >
                {sport}
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            background: "#111827",
            border: "1px solid #1f2937",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "24px",
          }}
        >
          <h2 style={{ marginTop: 0 }}>📊 Partidos de ejemplo</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
              marginTop: "16px",
            }}
          >
            {games.map((game, index) => (
              <div
                key={index}
                style={{
                  background: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "14px",
                  padding: "18px",
                }}
              >
                <div style={{ fontSize: "14px", opacity: 0.7, marginBottom: "8px" }}>
                  {game.sport}
                </div>
                <div style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "8px" }}>
                  {game.match}
                </div>
                <div style={{ marginBottom: "8px" }}>🎯 Pick: {game.pick}</div>
                <div style={{ color: "#60a5fa", fontWeight: "bold" }}>
                  Confianza: {game.confidence}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            background: "#111827",
            border: "1px solid #1f2937",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <h2 style={{ marginTop: 0 }}>🔜 Próximamente</h2>
          <ul style={{ lineHeight: "1.8" }}>
            <li>Estadísticas históricas</li>
            <li>Predicciones automáticas</li>
            <li>Panel visual por deporte</li>
            <li>Sección de mejores picks</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
