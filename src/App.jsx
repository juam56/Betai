import React, { useState } from "react";

const schedule = {
  HOY: [
    {
      sport: "NFL",
      match: "Chiefs vs Bills",
      time: "8:20 PM",
      home: "Chiefs",
      away: "Bills",
      homeProb: 58,
      awayProb: 42,
      confidence: "Alta",
      note: "Mejor forma ofensiva en los últimos partidos.",
    },
    {
      sport: "NBA",
      match: "Lakers vs Celtics",
      time: "7:30 PM",
      home: "Lakers",
      away: "Celtics",
      homeProb: 44,
      awayProb: 56,
      confidence: "Media",
      note: "Celtics llega con mejor eficiencia reciente.",
    },
    {
      sport: "SOCCER",
      match: "Inter Miami vs Orlando City",
      time: "7:00 PM",
      home: "Inter Miami",
      draw: "Empate",
      away: "Orlando City",
      homeProb: 46,
      drawProb: 25,
      awayProb: 29,
      confidence: "Media",
      note: "Ataques con buen momento, alta probabilidad de goles.",
    },
    {
      sport: "MLB",
      match: "Yankees vs Red Sox",
      time: "6:40 PM",
      home: "Yankees",
      away: "Red Sox",
      homeProb: 55,
      awayProb: 45,
      confidence: "Media",
      note: "Ventaja ligera por bullpen y localía.",
    },
  ],
  MANANA: [
    {
      sport: "NFL",
      match: "49ers vs Eagles",
      time: "8:15 PM",
      home: "49ers",
      away: "Eagles",
      homeProb: 54,
      awayProb: 46,
      confidence: "Media",
      note: "Partido cerrado, pequeña ventaja para 49ers.",
    },
    {
      sport: "NBA",
      match: "Heat vs Bucks",
      time: "8:00 PM",
      home: "Heat",
      away: "Bucks",
      homeProb: 39,
      awayProb: 61,
      confidence: "Alta",
      note: "Bucks con mejor diferencial y profundidad.",
    },
    {
      sport: "SOCCER",
      match: "Real Madrid vs Barcelona",
      time: "3:00 PM",
      home: "Real Madrid",
      draw: "Empate",
      away: "Barcelona",
      homeProb: 41,
      drawProb: 27,
      awayProb: 32,
      confidence: "Media",
      note: "Clásico con ligera ventaja local.",
    },
    {
      sport: "MLB",
      match: "Dodgers vs Mets",
      time: "9:10 PM",
      home: "Dodgers",
      away: "Mets",
      homeProb: 59,
      awayProb: 41,
      confidence: "Alta",
      note: "Pitcher abridor y ofensiva favorecen a Dodgers.",
    },
  ],
  D2: [
    {
      sport: "NFL",
      match: "Cowboys vs Giants",
      time: "4:25 PM",
      home: "Cowboys",
      away: "Giants",
      homeProb: 63,
      awayProb: 37,
      confidence: "Alta",
      note: "Mayor consistencia ofensiva y ventaja de local.",
    },
    {
      sport: "NBA",
      match: "Suns vs Nuggets",
      time: "10:00 PM",
      home: "Suns",
      away: "Nuggets",
      homeProb: 48,
      awayProb: 52,
      confidence: "Media",
      note: "Juego equilibrado con ligera ventaja visitante.",
    },
    {
      sport: "SOCCER",
      match: "Arsenal vs Liverpool",
      time: "11:30 AM",
      home: "Arsenal",
      draw: "Empate",
      away: "Liverpool",
      homeProb: 38,
      drawProb: 29,
      awayProb: 33,
      confidence: "Media",
      note: "Muy parejo, empate también tiene peso.",
    },
    {
      sport: "MLB",
      match: "Astros vs Mariners",
      time: "8:10 PM",
      home: "Astros",
      away: "Mariners",
      homeProb: 57,
      awayProb: 43,
      confidence: "Media",
      note: "Astros con ligera ventaja por matchup ofensivo.",
    },
  ],
  D3: [
    {
      sport: "NFL",
      match: "Ravens vs Bengals",
      time: "8:20 PM",
      home: "Ravens",
      away: "Bengals",
      homeProb: 56,
      awayProb: 44,
      confidence: "Media",
      note: "Ravens mejor en defensa reciente.",
    },
    {
      sport: "NBA",
      match: "Warriors vs Clippers",
      time: "10:30 PM",
      home: "Warriors",
      away: "Clippers",
      homeProb: 51,
      awayProb: 49,
      confidence: "Baja",
      note: "Partido muy ajustado, poca diferencia estadística.",
    },
    {
      sport: "SOCCER",
      match: "Man City vs Chelsea",
      time: "2:45 PM",
      home: "Man City",
      draw: "Empate",
      away: "Chelsea",
      homeProb: 62,
      drawProb: 21,
      awayProb: 17,
      confidence: "Alta",
      note: "City domina en forma reciente y posesión.",
    },
    {
      sport: "MLB",
      match: "Braves vs Phillies",
      time: "7:20 PM",
      home: "Braves",
      away: "Phillies",
      homeProb: 53,
      awayProb: 47,
      confidence: "Media",
      note: "Braves con leve ventaja por producción ofensiva.",
    },
  ],
};

const labels = {
  HOY: "Hoy",
  MANANA: "Mañana",
  D2: "+2 días",
  D3: "+3 días",
};

const sportColors = {
  NFL: "#f97316",
  NBA: "#22c55e",
  SOCCER: "#06b6d4",
  MLB: "#eab308",
};

function ProbabilityBar({ label, value, color }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "4px",
          fontSize: "14px",
        }}
      >
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div
        style={{
          width: "100%",
          height: "10px",
          background: "#243041",
          borderRadius: "999px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${value}%`,
            height: "100%",
            background: color,
            borderRadius: "999px",
          }}
        />
      </div>
    </div>
  );
}

export default function App() {
  const [selectedDay, setSelectedDay] = useState("HOY");
  const [selectedSport, setSelectedSport] = useState("ALL");

  const sports = ["ALL", "NFL", "NBA", "SOCCER", "MLB"];

  const games =
    selectedSport === "ALL"
      ? schedule[selectedDay]
      : schedule[selectedDay].filter((game) => game.sport === selectedSport);

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #08111f 0%, #0f172a 45%, #1e1b4b 100%)",
        color: "white",
        fontFamily: "Arial, sans-serif",
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: "1150px", margin: "0 auto" }}>
        <header style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1
            style={{
              fontSize: "52px",
              marginBottom: "8px",
              color: "#60a5fa",
              textShadow: "0 0 20px rgba(96,165,250,0.35)",
            }}
          >
            Betai
          </h1>
          <p style={{ color: "#cbd5e1", fontSize: "18px" }}>
            Probabilidades estimadas por partido
          </p>
        </header>

        <section
          style={{
            background: "linear-gradient(135deg, #1d4ed8, #7c3aed)",
            borderRadius: "18px",
            padding: "22px",
            marginBottom: "22px",
            boxShadow: "0 10px 30px rgba(59,130,246,0.25)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>📅 Fechas disponibles</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {Object.keys(labels).map((day) => {
              const active = selectedDay === day;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  style={{
                    background: active ? "#ffffff" : "rgba(255,255,255,0.12)",
                    color: active ? "#111827" : "#ffffff",
                    border: "none",
                    padding: "12px 18px",
                    borderRadius: "12px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  {labels[day]}
                </button>
              );
            })}
          </div>
        </section>

        <section
          style={{
            background: "#111827",
            border: "1px solid #334155",
            borderRadius: "18px",
            padding: "22px",
            marginBottom: "22px",
          }}
        >
          <h2 style={{ marginTop: 0 }}>🏆 Filtrar por deporte</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
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
                    border: active ? "1px solid #67e8f9" : "1px solid #374151",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  {sport === "ALL" ? "TODOS" : sport}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h2 style={{ marginBottom: "16px" }}>
            📊 Partidos -{" "}
            <span style={{ color: "#60a5fa" }}>{labels[selectedDay]}</span>
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "16px",
            }}
          >
            {games.map((game, index) => (
              <div
                key={index}
                style={{
                  background: "linear-gradient(180deg, #1f2937, #111827)",
                  border: `2px solid ${sportColors[game.sport]}`,
                  borderRadius: "18px",
                  padding: "18px",
                  boxShadow: `0 0 18px ${sportColors[game.sport]}33`,
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    background: sportColors[game.sport],
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

                <div style={{ fontSize: "14px", color: "#cbd5e1", marginBottom: "8px" }}>
                  🕒 {game.time}
                </div>

                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: "bold",
                    marginBottom: "14px",
                  }}
                >
                  {game.match}
                </div>

                <div style={{ marginBottom: "14px" }}>
                  <ProbabilityBar
                    label={game.home}
                    value={game.homeProb}
                    color={sportColors[game.sport]}
                  />

                  {"drawProb" in game && (
                    <ProbabilityBar
                      label="Empate"
                      value={game.drawProb}
                      color="#a78bfa"
                    />
                  )}

                  <ProbabilityBar
                    label={game.away}
                    value={game.awayProb}
                    color="#38bdf8"
                  />
                </div>

                <div
                  style={{
                    background: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "12px",
                    padding: "12px",
                  }}
                >
                  <div style={{ marginBottom: "8px" }}>
                    🧠 <strong>Confianza:</strong> {game.confidence}
                  </div>
                  <div style={{ color: "#cbd5e1", fontSize: "14px" }}>
                    📝 {game.note}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {games.length === 0 && (
            <div
              style={{
                background: "#111827",
                border: "1px solid #334155",
                borderRadius: "16px",
                padding: "20px",
                marginTop: "16px",
              }}
            >
              No hay partidos para ese deporte en esa fecha.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
