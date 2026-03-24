const SPORT_CONFIG = [
  { key: "baseball_mlb", label: "MLB", regions: "us" },
  { key: "soccer_epl", label: "SOCCER", regions: "uk,eu" },
  { key: "soccer_spain_la_liga", label: "SOCCER", regions: "uk,eu" },
];

function americanToProbability(price) {
  if (typeof price !== "number") return null;
  if (price > 0) return 100 / (price + 100);
  return Math.abs(price) / (Math.abs(price) + 100);
}

function chooseBookmaker(bookmakers = []) {
  if (!Array.isArray(bookmakers) || bookmakers.length === 0) return null;

  const preferred = bookmakers.find((b) => {
    const text = `${b.title || ""} ${b.key || ""}`.toLowerCase();
    return (
      text.includes("hard rock") ||
      text.includes("hardrock") ||
      text.includes("seminole")
    );
  });

  return preferred || bookmakers[0] || null;
}

function normalizeMarket(market) {
  if (!market) return null;

  return {
    key: market.key,
    outcomes: (market.outcomes || []).map((o) => ({
      name: o.name,
      price: o.price,
      point: typeof o.point === "number" ? o.point : null,
      impliedProbability: americanToProbability(o.price),
    })),
  };
}

async function loadSport(config, apiKey) {
  try {
    const url =
      `https://api.the-odds-api.com/v4/sports/${config.key}/odds/` +
      `?apiKey=${apiKey}` +
      `&regions=${config.regions}` +
      `&markets=h2h,spreads,totals` +
      `&oddsFormat=american` +
      `&dateFormat=iso`;

    const response = await fetch(url);

    if (!response.ok) {
      const text = await response.text();

      try {
        const parsed = JSON.parse(text);
        return { events: [], error: parsed };
      } catch {
        return { events: [], error: { message: text } };
      }
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      return { events: [] };
    }

    const events = data.map((event) => {
      const bookmaker = chooseBookmaker(event.bookmakers || []);
      const markets = bookmaker?.markets || [];

      return {
        id: `${config.key}_${event.id}`,
        sport: config.label,
        league: event.sport_title || config.key,
        commence_time: event.commence_time,
        home_team: event.home_team,
        away_team: event.away_team,
        bookmaker: bookmaker ? bookmaker.title : "Sin bookmaker disponible",
        markets: {
          h2h: normalizeMarket(markets.find((m) => m.key === "h2h")),
          spreads: normalizeMarket(markets.find((m) => m.key === "spreads")),
          totals: normalizeMarket(markets.find((m) => m.key === "totals")),
        },
      };
    });

    return { events };
  } catch (error) {
    return { events: [], error: { message: error.message } };
  }
}

module.exports = async (req, res) => {
  try {
    const apiKey = process.env.ODDS_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "Falta la variable ODDS_API_KEY en Vercel",
      });
    }

    const results = await Promise.all(
      SPORT_CONFIG.map((config) => loadSport(config, apiKey))
    );

    const possibleErrors = results
      .map((r) => r.error)
      .filter(Boolean);

    const now = new Date();

    const endTomorrow = new Date();
    endTomorrow.setDate(endTomorrow.getDate() + 1);
    endTomorrow.setHours(23, 59, 59, 999);

    const events = results
      .flatMap((r) => r.events || [])
      .filter((event) => {
        const date = new Date(event.commence_time);
        return !isNaN(date.getTime()) && date >= now && date <= endTomorrow;
      })
      .sort((a, b) => new Date(a.commence_time) - new Date(b.commence_time));

    const bySport = {
      MLB: events.filter((e) => e.sport === "MLB").length,
      SOCCER: events.filter((e) => e.sport === "SOCCER").length,
    };

    res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=1200");

    return res.status(200).json({
      total: events.length,
      bySport,
      events,
      warnings: possibleErrors,
    });
  } catch (error) {
    return res.status(500).json({
      error: "No se pudieron cargar los datos reales",
      detail: error.message,
    });
  }
};
