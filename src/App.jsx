import React, { useEffect, useMemo, useState } from "react";

const DAY_LABELS = {
  HOY: "Hoy",
  D1: "Mañana",
  D2: "+2 días",
  D3: "+3 días",
};

const SPORT_COLORS = {
  NFL: "#f97316",
  NBA: "#22c55e",
  SOCCER: "#06b6d4",
  MLB: "#eab308",
};

function getDayBucket(dateString) {
  const now = new Date();
  const target = new Date(dateString);

  const startNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startTarget = new Date(
    target.getFullYear(),
    target.getMonth(),
    target.getDate()
  );

  const diff = Math.round((startTarget - startNow) / (1000 * 60 * 60 * 24));

  if (diff === 0) return "HOY";
  if (diff === 1) return "D1";
  if (diff === 2) return "D2";
  if (diff === 3) return "D3";
  return null;
}

function groupByDay(events) {
  const grouped = { HOY: [], D1: [], D2: [], D3: [] };

  events.forEach((event) => {
    const bucket = getDayBucket(event.commence_time);
    if (bucket) grouped[bucket].push(event);
  });

  return grouped;
}

function formatOdds(price) {
  if (typeof price !== "number") return "-";
  return price > 0 ? `+${price}` : `${price}`;
}

function formatDateTime(dateString) {
  return new Date(dateString).toLocaleString("es-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function normalizeProbabilities(outcomes = []) {
  const valid = outcomes.filter((o) => typeof o.impliedProbability === "number");
  const total = valid.reduce((sum, o) => sum + o.impliedProbability, 0);

  return outcomes.map((o) => ({
    ...o,
    normalizedProbability:
      total > 0 && typeof o.impliedProbability === "number"
        ? Math.round((o.impliedProbability / total) * 100)
        : null,
  }));
}

function ProbabilityBar({ label, value, color }) {
  if (value == null) return null;

  return (
    <div style={{ marginBottom: "10px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "14px",
          marginBottom: "4px",
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

function MarketList({ title, outcomes }) {
  if (!outcomes || outcomes.length === 0) return null;

  return (
    <div
      style={{
        background: "#0f172a",
        border: "1px solid #334155",
        borderRadius: "12px",
        padding: "12px",
        marginTop: "12px",
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: "8px" }}>{title}</div>

      <div style={{ display: "grid", gap: "6px" }}>
        {outcomes.map((item, index) => (
          <div
            key={index}
            style={{
              fontSize: "14px",
              color: "#cbd5e1",
              display: "flex",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            <span>
              {item.name}
              {typeof item.point === "number"
                ? ` ${item.point > 0 ? "+" : ""}${item.point}`
                : ""}
            </span>
            <span>{formatOdds(item.price)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [events, setEvents] = useState([]);
  const [selectedDay, setSelectedDay] = useState("HOY");
  const [selectedSport, setSelectedSport] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/odds");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "No se pudieron cargar los partidos");
        }

        setEvents(data.events || []);
      } catch (err) {
        setError(err.message || "Error cargando datos");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const grouped = useMemo(() => groupByDay(events), [events]);

  const sports = ["ALL", "NFL", "NBA", "SOCCER", "MLB"];

  const visibleGames =
    selectedSport === "ALL"
      ? grouped[selectedDay] || []
      : (grouped[selectedDay] || []).filter((g) => g.sport === selectedSport);

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
        <header style={{ textAlign: "center", marginBottom: "28px" }}>
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
            Partidos reales y probabilidades implícitas por mercado
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
          <h2 style={{ marginTop: 0 }}>📅 Fechas</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {Object.keys(DAY_LABELS).map((day) => {
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
                  {DAY_LABELS[day]}
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
          <h2 style={{ marginTop: 0 }}>🏆 Deporte</h2>
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

        {loading && (
          <div
            style={{
              background: "#111827",
              border: "1px solid #334155",
              borderRadius: "18px",
              padding: "20px",
            }}
          >
            ⏳ Cargando partidos reales...
          </div>
        )}

        {error && (
          <div
            style={{
              background: "#3b0d0d",
              border: "1px solid #7f1d1d",
              color: "#fecaca",
              borderRadius: "18px",
              padding: "20px",
              marginBottom: "20px",
            }}
          >
            ❌ {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <h2 style={{ marginBottom: "16px" }}>
              📊 Partidos -{" "}
              <span style={{ color: "#60a5fa" }}>{DAY_LABELS[selectedDay]}</span>
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "16px",
              }}
            >
              {visibleGames.map((game) => {
                const color = SPORT_COLORS[game.sport] || "#60a5fa";
                const h2hOutcomes = normalizeProbabilities(
                  game.markets?.h2h?.outcomes || []
                );

                return (
                  <div
                    key={game.id}
                    style={{
                      background: "linear-gradient(180deg, #1f2937, #111827)",
                      border: `2px solid ${color}`,
                      borderRadius: "18px",
                      padding: "18px",
                      boxShadow: `0 0 18px ${color}33`,
                    }}
                  >
                    <div
                      style={{
                        display: "inline-block",
                        background: color,
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

                    <div style={{ fontSize: "14px", color: "#cbd5e1", marginBottom: "6px" }}>
                      🏟️ {game.league}
                    </div>

                    <div style={{ fontSize: "14px", color: "#cbd5e1", marginBottom: "8px" }}>
                      🕒 {formatDateTime(game.commence_time)}
                    </div>

                    <div
                      style={{
                        fontSize: "22px",
                        fontWeight: "bold",
                        marginBottom: "12px",
                      }}
                    >
                      {game.away_team} vs {game.home_team}
                    </div>

                    <div
                      style={{
                        background: "#0f172a",
                        border: "1px solid #334155",
                        borderRadius: "12px",
                        padding: "12px",
                        marginBottom: "12px",
                      }}
                    >
                      <div style={{ marginBottom: "10px", fontWeight: "bold" }}>
                        📈 Probabilidades implícitas
                      </div>

                      {h2hOutcomes.length > 0 ? (
                        h2hOutcomes.map((outcome, index) => (
                          <ProbabilityBar
                            key={index}
                            label={`${outcome.name} (${formatOdds(outcome.price)})`}
                            value={outcome.normalizedProbability}
                            color={index === 0 ? color : "#38bdf8"}
                          />
                        ))
                      ) : (
                        <div style={{ color: "#94a3b8", fontSize: "14px" }}>
                          Sin mercado principal disponible
                        </div>
                      )}
                    </div>

                    <MarketList
                      title="💲 Spread"
                      outcomes={game.markets?.spreads?.outcomes || []}
                    />

                    <MarketList
                      title="📊 Totales"
                      outcomes={game.markets?.totals?.outcomes || []}
                    />

                    <div
                      style={{
                        marginTop: "12px",
                        fontSize: "13px",
                        color: "#cbd5e1",
                      }}
                    >
                      📚 Fuente mostrada: <strong>{game.bookmaker}</strong>
                    </div>
                  </div>
                );
              })}
            </div>

            {visibleGames.length === 0 && (
              <div
                style={{
                  background: "#111827",
                  border: "1px solid #334155",
                  borderRadius: "18px",
                  padding: "20px",
                  marginTop: "16px",
                }}
              >
                No hay partidos para ese filtro en esta fecha.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
