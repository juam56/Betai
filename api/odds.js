function americanToProbability(price) {
  if (typeof price !== "number") return null;
  if (price > 0) return 100 / (price + 100);
  return Math.abs(price) / (Math.abs(price) + 100);
}

function chooseBookmaker(bookmakers = []) {
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

function mapSportName(sportKey = "", sportTitle = "") {
  const text = `${sportKey} ${sportTitle}`.toLowerCase();

  if (text.includes("nfl") || text.includes("americanfootball")) return "NFL";
  if (text.includes("nba") || text.includes("basketball")) return "NBA";
  if (text.includes("mlb") || text.includes("baseball")) return "MLB";
  if (text.includes("soccer")) return "SOCCER";

  return sportTitle || sportKey || "OTRO";
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
      `?apiKey=${apiKey}&regions=us&markets=h2h,spreads,totals&oddsFormat=american&dateFormat=iso`;

    const response = await fetch(url);

    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({
        error: "La API externa no respondió bien",
        detail: text,
      });
    }

    const data = await response.json();

    const allowedSports = ["NFL", "NBA", "MLB", "SOCCER"];

    const events = (data || [])
      .map((event) => {
        const sport = mapSportName(event.sport_key, event.sport_title);

        if (!allowedSports.includes(sport)) return null;

        const bookmaker = chooseBookmaker(event.bookmakers || []);
        const markets = bookmaker?.markets || [];

        const h2h = normalizeMarket(markets.find((m) => m.key === "h2h"));
        const spreads = normalizeMarket(markets.find((m) => m.key === "spreads"));
        const totals = normalizeMarket(markets.find((m) => m.key === "totals"));

        return {
          id: event.id,
          sport,
          league: event.sport_title || event.sport_key,
          commence_time: event.commence_time,
          home_team: event.home_team,
          away_team: event.away_team,
          bookmaker: bookmaker ? bookmaker.title : "Sin bookmaker disponible",
          markets: {
            h2h,
            spreads,
            totals,
          },
        };
      })
      .filter(Boolean)
      .sort((a, b) => new Date(a.commence_time) - new Date(b.commence_time));

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");

    return res.status(200).json({ events });
  } catch (error) {
    return res.status(500).json({
      error: "No se pudieron cargar los datos reales",
      detail: error.message,
    });
  }
};
