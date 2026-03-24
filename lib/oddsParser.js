/**
 * Convierte cuotas crudas a probabilidades implícitas para el resumen de respuesta.
 */

export function parseOdds(odds, sport) {
  if (sport === 'MLB' || sport === 'NBA') {
    return parseAmericanOdds(odds);
  }
  if (sport === 'SOCCER') {
    return parseDecimalOdds(odds);
  }
  return odds;
}

function parseAmericanOdds(odds) {
  const toProb = (american) => {
    if (!american) return null;
    american = Number(american);
    if (american < 0) return Math.abs(american) / (Math.abs(american) + 100);
    return 100 / (american + 100);
  };

  const probHome = toProb(odds.home_ml);
  const probAway = toProb(odds.away_ml);
  const overround = probHome && probAway ? +(probHome + probAway - 1).toFixed(4) : null;

  return {
    format: 'american',
    home_ml: odds.home_ml,
    away_ml: odds.away_ml,
    implied_prob_home: probHome ? +probHome.toFixed(4) : null,
    implied_prob_away: probAway ? +probAway.toFixed(4) : null,
    overround,
    vig_pct: overround ? +(overround * 100).toFixed(2) : null,
    total_line: odds.total_line ?? null,
  };
}

function parseDecimalOdds(odds) {
  const toProb = (decimal) => decimal ? +(1 / decimal).toFixed(4) : null;

  const probHome = toProb(odds.home);
  const probDraw = toProb(odds.draw);
  const probAway = toProb(odds.away);
  const sum = [probHome, probDraw, probAway].filter(Boolean).reduce((a, b) => a + b, 0);
  const overround = sum > 0 ? +(sum - 1).toFixed(4) : null;

  return {
    format: 'decimal',
    home: odds.home,
    draw: odds.draw,
    away: odds.away,
    implied_prob_home: probHome,
    implied_prob_draw: probDraw,
    implied_prob_away: probAway,
    overround,
    vig_pct: overround ? +(overround * 100).toFixed(2) : null,
  };
}
