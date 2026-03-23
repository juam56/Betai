import React, { useState } from "react";

const games = [
  {
    sport: "NFL",
    match: "Chiefs vs Bills",
    pick: "Chiefs gana",
    confidence: "68%",
  },
  {
    sport: "NFL",
    match: "49ers vs Eagles",
    pick: "Más de 47.5 puntos",
    confidence: "66%",
  },
  {
    sport: "NBA",
    match: "Lakers vs Celtics",
    pick: "Más de 219.5 puntos",
    confidence: "72%",
  },
  {
    sport: "NBA",
    match: "Heat vs Bucks",
    pick: "Bucks gana",
    confidence: "69%",
  },
  {
    sport: "SOCCER",
    match: "Inter Miami vs Orlando City",
    pick: "Ambos anotan",
    confidence: "64%",
  },
  {
    sport: "SOCCER",
    match: "Real Madrid vs Barcelona",
    pick: "Más de 2.5 goles",
    confidence: "71%",
  },
  {
    sport: "MLB",
    match: "Yankees vs Red Sox",
    pick: "Yankees gana",
    confidence: "61%",
  },
  {
    sport: "MLB",
    match: "Dodgers vs Mets",
    pick: "Menos de 8.5 carreras",
    confidence: "67%",
  },
];

export default function App() {
  const [selectedSport, setSelectedSport] = useState("ALL");

  const sports = ["ALL", "NFL", "NBA", "SOCCER", "MLB"];

  const filteredGames =
    selectedSport === "ALL"
      ? games
      : games.filter((game) => game.sport === selectedSport);

  const getSportColor = (sport) => {
    switch (sport) {
      case "NFL":
        return "#f97316";
      case "NBA":
        return "#22c55e";
      case "SOCCER":
        return "#06b6d4";
      case "MLB":
        return "#eab308";
      default:
        return "#8b5cf6";
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #0f172a 0%, #111827 35%, #1e1b4b 100%)",
        color: "white",
        fontFamily: "Arial, sans-serif",
        padding: "30px",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <header style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1
            style={{
              fontSize: "52px",
              marginBottom: "10px",
              color: "#60a5fa",
              textShadow: "0 0 18px rgba(96,165,250,0.45)",
            }}
          >
            Betai
          </h1>
          <p style={{ fontSize: "18px", opacity: 0.9, color: "#cbd5e1" }}>
            Plataforma MVP de análisis deportivo
          </p>
        </header>

        <section
          style={{
            background: "linear-gradient(135deg, #1d4ed8, #7c3aed)",
            borderRadius: "18px",
            padding: "24px",
            marginBottom: "26px",
            boxShadow: "0 10px 30px rgba(59,130,246,0.25)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>🚀 Estado del proyecto</h2>
          <p style={{ marginBottom: 0 }}>
            Betai ya está online y ahora puede mostrar picks por deporte con un
            diseño más llamativo y visual.
          </p>
        </section>

        <section
          style={{
            background: "#111827",
            border: "1px solid #374151",
            borderRadius: "18px",
            padding: "24px",
            marginBottom: "26px",
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: "18px" }}>
            🏆 Selecciona un deporte
          </h2>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            {sports.map((sport) => {
              const active = selectedSport === sport;
              return (
                <button
                  key={sport}
                  onClick={() => setSelectedSport(sport)}
                  style={{
                    background: active
                      ? "linear-gradient(135deg, #06b6d4, #3b82f6)"
                      : "#1f2937",
                    color: "white",
                    border: active
                      ? "1px solid #67e8f9"
                      : "1px solid #374151",
                    padding: "12px 18px",
                    borderRadius: "12px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    boxShadow: active
                      ? "0 0 18px rgba(59,130,246,0.45)"
                      : "none",
                  }}
                >
                  {sport === "ALL" ? "TODOS" : sport}
                </button>
              );
            })}
          </div>
        </section>

        <section
          style={{
            background: "#111827",
            border: "1px solid #374151",
            borderRadius: "18px",
            padding: "24px",
            marginBottom: "26px",
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            📊 Partidos de ejemplo{" "}
            <span style={{ color: "#60a5fa" }}>
              ({selectedSport === "ALL" ? "Todos" : selectedSport})
            </span>
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "16px",
              marginTop: "18px",
            }}
          >
            {filteredGames.map((game, index) => (
              <div
                key={index}
                style={{
                  background: "linear-gradient(180deg, #1f2937, #111827)",
                  border: `2px solid ${getSportColor(game.sport)}`,
                  borderRadius: "16px",
                  padding: "18px",
                  boxShadow: `0 0 18px ${getSportColor(game.sport)}33`,
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    background: getSportColor(game.sport),
                    color: "#0f172a",
                    fontWeight: "bold",
                    borderRadius: "999px",
                    padding: "6px 12px",
                    fontSize: "13px",
                    marginBottom: "12px",
                  }}
                >
                  {game.sport}
                </div>

                <div
                  style={{
                    fontSize: "21px",
                    fontWeight: "bold",
                    marginBottom: "10px",
                  }}
                >
                  {game.match}
                </div>

                <div style={{ marginBottom: "8px", color: "#e5e7eb" }}>
                  🎯 Pick: <strong>{game.pick}</strong>
                </div>

                <div
                  style={{
                    color: "#38bdf8",
                    fontWeight: "bold",
                    fontSize: "18px",
                  }}
                >
                  Confianza: {game.confidence}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            background: "linear-gradient(135deg, #0f172a, #1e293b)",
            border: "1px solid #334155",
            borderRadius: "18px",
            padding: "24px",
          }}
        >
          <h2 style={{ marginTop: 0, color: "#f472b6" }}>🔜 Próximamente</h2>
          <ul style={{ lineHeight: "1.9", color: "#e2e8f0", paddingLeft: "20px" }}>
            <li>Más partidos por deporte</li>
            <li>Más picks y estadísticas</li>
            <li>Panel visual más avanzado</li>
            <li>Vista de mejores oportunidades</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
