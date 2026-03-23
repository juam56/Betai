import React from "react";

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
            Betai ya está en línea. El siguiente paso es agregar paneles,
            deportes, estadísticas y predicciones visuales.
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
          }}
        >
          <h2 style={{ marginTop: 0 }}>📊 Próximamente</h2>
          <ul style={{ lineHeight: "1.8" }}>
            <li>Predicciones por deporte</li>
            <li>Estadísticas históricas</li>
            <li>Panel visual de partidos</li>
            <li>Mejores picks informativos</li>
          </ul>

          <button
            style={{
              marginTop: "16px",
              background: "#2563eb",
              color: "white",
              border: "none",
              padding: "12px 20px",
              borderRadius: "10px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Ver panel próximamente
          </button>
        </section>
      </div>
    </div>
  );
}
