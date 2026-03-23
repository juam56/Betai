const SPORT_KEYS = [
  "americanfootball_nfl",
  "basketball_nba",
  "baseball_mlb",
  "soccer_usa_mls",
  "soccer_epl",
  "soccer_spain_la_liga"
];

const SPORT_LABELS = {
  americanfootball_nfl: "NFL",
  basketball_nba: "NBA",
  baseball_mlb: "MLB",
  soccer_usa_mls: "SOCCER",
  soccer_epl: "SOCCER",
  soccer_spain_la_liga: "SOCCER"
};

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
      impliedProbability: americanToProbability(o.price)
    }))
  };
}

module.exports = async (req, res) => {
  try {
    const apiKey = process.env.ODDS_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "Falta la variable ODDS_API_KEY en Vercel"
      });
    }

    const responses = await Promise.all(
      SPORT_KEYS.map(async (sportKey) => {
        const url =
          `https://api.the-odds-api.com/v4/sports/${sportKey}/odds/` +
          `?apiKey=${apiKey}&regions=us&markets=h2h,spreads,totals&oddsFormat=american&dateFormat=iso`;

        const response = await fetch(url);

        if (!response.ok) {
          return [];
        }

        const data = await response.json();

        return data.map((event) => {
          const bookmaker = chooseBookmaker(event.bookmakers || []);
          const markets = bookmaker?.markets || [];

          const h2h = normalizeMarket(markets.find((m) => m.key === "h2h"));
          const spreads = normalizeMarket(markets.find((m) => m.key === "spreads"));
          const totals = normalizeMarket(markets.find((m) => m.key === "totals"));

          return {
            id: event.id,
            sport: SPORT_LABELS[sportKey] || event.sport_title || sportKey,
            league: event.sport_title || sportKey,
            commence_time: event.commence_time,
            home_team: event.home_team,
            away_team: event.away_team,
            bookmaker: bookmaker ? bookmaker.title : "Sin bookmaker disponible",
            markets: {
              h2h,
              spreads,
              totals
            }
          };
        });
      })
    );

    const events = responses.flat().sort((a, b) => {
      return new Date(a.commence_time) - new Date(b.commence_time);
    });

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");

    return res.status(200).json({ events });
  } catch (error) {
    return res.status(500).json({
      error: "No se pudieron cargar los datos reales",
      detail: error.message
    });
  }
};
