
       const SPORT_KEYS = [
  "basketball_nba",
  "baseball_mlb",
  "americanfootball_nfl",
  "soccer_usa_mls",
  "soccer_epl",
  "soccer_spain_la_liga",
  "soccer_italy_serie_a",
  "soccer_germany_bundesliga"
];

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

function sportLabelFromKey(sportKey) {
  if (sportKey.includes("americanfootball_nfl")) return "NFL";
  if (sportKey.includes("basketball_nba")) return "NBA";
  if (sportKey.includes("baseball_mlb")) return "MLB";
  if (sportKey.includes("soccer")) return "SOCCER";
  return "OTRO";
}

module.exports = async (req, res) => {
  try {
    const apiKey = process.env.ODDS_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "Falta la variable ODDS_API_KEY en Vercel",
      });
    }

    const allResponses = await Promise.all(
      SPORT_KEYS.map(async (sportKey) => {
        const url =
          `https://api.the-odds-api.com/v4/sports/${sportKey}/odds/` +
     `?apiKey=${apiKey}&regions=us,uk,eu&markets=h2h,spreads,totals&oddsFormat=american&dateFormat=iso`;=iso`;

        const response = await fetch(url);

        if (!response.ok) {
          return [];
        }

        const data = await response.json();

        return (data || []).map((event) => {
          const bookmaker = chooseBookmaker(event.bookmakers || []);
          const markets = bookmaker?.markets || [];

          return {
            id: `${sportKey}_${event.id}`,
            sport: sportLabelFromKey(sportKey),
            league: event.sport_title || sportKey,
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
      })
    );

    const now = new Date();
    const maxDate = new Date();
    maxDate.setDate(now.getDate() + 3);

    const events = allResponses
      .flat()
      .filter((event) => {
        const eventDate = new Date(event.commence_time);
        return eventDate >= now && eventDate <= maxDate;
      })
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
