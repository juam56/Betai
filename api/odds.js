const EXACT_SPORTS = new Set([
  "americanfootball_nfl",
  "basketball_nba",
  "baseball_mlb",
]);

function isAllowedSport(sportKey = "") {
  return EXACT_SPORTS.has(sportKey) || sportKey.startsWith("soccer_");
}

function sportLabelFromKey(sportKey = "") {
  if (sportKey === "americanfootball_nfl") return "NFL";
  if (sportKey === "basketball_nba") return "NBA";
  if (sportKey === "baseball_mlb") return "MLB";
  if (sportKey.startsWith("soccer_")) return "SOCCER";
  return "OTRO";
}

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

module.exports = async (req, res) => {
  try {
    const apiKey = process.env.ODDS_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "Falta la variable ODDS_API_KEY en Vercel",
      });
    }

    const url =
      `https://api.the-odds-api.com/v4/sports/upcoming/odds/` +
      `?apiKey=${apiKey}` +
      `&regions=us,uk,eu` +
      `&markets=h2h,spreads,totals` +
      `&oddsFormat=american` +
      `&dateFormat=iso`;

    const response = await fetch(url);

    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({
        error: "La API externa no respondió bien",
        detail: text,
      });
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      return res.status(500).json({
        error: "La API no devolvió una lista válida",
      });
    }

    const now = new Date();
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 3);
    maxDate.setHours(23, 59, 59, 999);

    const events = data
      .filter((event) => isAllowedSport(event.sport_key))
      .map((event) => {
        const bookmaker = chooseBookmaker(event.bookmakers || []);
        const markets = bookmaker?.markets || [];

        return {
          id: event.id,
          sport: sportLabelFromKey(event.sport_key),
          league: event.sport_title || event.sport_key,
          sport_key: event.sport_key,
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
      })
      .filter((event) => {
        const eventDate = new Date(event.commence_time);
        return !isNaN(eventDate.getTime()) && eventDate >= now && eventDate <= maxDate;
      })
      .sort((a, b) => new Date(a.commence_time) - new Date(b.commence_time));

    const bySport = {
      NFL: events.filter((e) => e.sport === "NFL").length,
      NBA: events.filter((e) => e.sport === "NBA").length,
      MLB: events.filter((e) => e.sport === "MLB").length,
      SOCCER: events.filter((e) => e.sport === "SOCCER").length,
    };

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");

    return res.status(200).json({
      total: events.length,
      bySport,
      events,
    });
  } catch (error) {
    return res.status(500).json({
      error: "No se pudieron cargar los datos reales",
      detail: error.message,
    });
  }
};};
