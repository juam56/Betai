/**
 * Normaliza y valida el payload del partido antes de enviarlo a la IA.
 * Rellena campos faltantes con null para que la IA sepa qué datos faltan.
 */

export function buildGamePayload({ sport, home, away, odds, context = {} }) {
  switch (sport) {
    case 'MLB':    return buildMLB(home, away, odds, context);
    case 'SOCCER': return buildSoccer(home, away, odds, context);
    case 'NBA':    return buildNBA(home, away, odds, context);
    default:       throw new Error(`Unknown sport: ${sport}`);
  }
}

// ─── MLB ────────────────────────────────────────────────────────────────────

function buildMLB(home, away, odds, ctx) {
  return {
    sport: 'MLB',
    home: {
      team:                  str(home.team),
      starter_era:           num(home.starter_era),
      starter_whip_l30:      num(home.starter_whip_l30),
      starter_hand:          str(home.starter_hand),         // "R" | "L"
      starter_rest_days:     num(home.starter_rest_days),
      bullpen_era_l7:        num(home.bullpen_era_l7),
      woba:                  num(home.woba),
      ops_vs_righty:         num(home.ops_vs_righty),
      ops_vs_lefty:          num(home.ops_vs_lefty),
      runs_per_game_l10:     num(home.runs_per_game_l10),
      babip:                 num(home.babip),
      record_l10:            str(home.record_l10),           // "7-3"
      injuries:              arr(home.injuries),
    },
    away: {
      team:                  str(away.team),
      starter_era:           num(away.starter_era),
      starter_whip_l30:      num(away.starter_whip_l30),
      starter_hand:          str(away.starter_hand),
      starter_rest_days:     num(away.starter_rest_days),
      bullpen_era_l7:        num(away.bullpen_era_l7),
      woba:                  num(away.woba),
      ops_vs_righty:         num(away.ops_vs_righty),
      ops_vs_lefty:          num(away.ops_vs_lefty),
      runs_per_game_l10:     num(away.runs_per_game_l10),
      babip:                 num(away.babip),
      record_l10:            str(away.record_l10),
      injuries:              arr(away.injuries),
    },
    context: {
      stadium:               str(ctx.stadium),
      park_factor:           num(ctx.park_factor) ?? 1.0,
      weather_temp_f:        num(ctx.weather_temp_f),
      wind_mph:              num(ctx.wind_mph),
      wind_dir:              str(ctx.wind_dir),              // "out" | "in" | "cross"
      h2h_l2y:               ctx.h2h_l2y ?? null,
    },
    odds: {
      home_ml:               num(odds.home_ml),              // american: -165
      away_ml:               num(odds.away_ml),              // american: +140
      total_line:            num(odds.total_line),
      total_over:            num(odds.total_over) ?? -110,
      total_under:           num(odds.total_under) ?? -110,
      open_home_ml:          num(odds.open_home_ml),
      public_pct_home:       num(odds.public_pct_home),
      money_pct_home:        num(odds.money_pct_home),
    }
  };
}

// ─── SOCCER ─────────────────────────────────────────────────────────────────

function buildSoccer(home, away, odds, ctx) {
  return {
    sport: 'SOCCER',
    competition:             str(ctx.competition),
    importance:              str(ctx.importance) ?? 'regular',
    home: {
      team:                  str(home.team),
      xg_for_l5:             num(home.xg_for_l5),
      xga_against_l5:        num(home.xga_against_l5),
      goals_scored_l5:       num(home.goals_scored_l5),
      goals_conceded_l5:     num(home.goals_conceded_l5),
      pts_home_l5:           num(home.pts_home_l5),
      win_rate_home:         num(home.win_rate_home),
      ppda_l5:               num(home.ppda_l5),
      possession_avg_l5:     num(home.possession_avg_l5),
      shots_on_target_pg:    num(home.shots_on_target_pg),
      rest_days:             num(home.rest_days),
      injuries:              arr(home.injuries),
      h2h_l5_wins:           num(home.h2h_l5_wins),
    },
    away: {
      team:                  str(away.team),
      xg_for_l5:             num(away.xg_for_l5),
      xga_against_l5:        num(away.xga_against_l5),
      goals_scored_l5:       num(away.goals_scored_l5),
      goals_conceded_l5:     num(away.goals_conceded_l5),
      pts_away_l5:           num(away.pts_away_l5),
      win_rate_away:         num(away.win_rate_away),
      ppda_l5:               num(away.ppda_l5),
      possession_avg_l5:     num(away.possession_avg_l5),
      shots_on_target_pg:    num(away.shots_on_target_pg),
      rest_days:             num(away.rest_days),
      injuries:              arr(away.injuries),
      h2h_l5_wins:           num(away.h2h_l5_wins),
    },
    odds: {
      home:                  num(odds.home),                 // decimal: 2.10
      draw:                  num(odds.draw),
      away:                  num(odds.away),
      over_2_5:              num(odds.over_2_5),
      under_2_5:             num(odds.under_2_5),
      btts_yes:              num(odds.btts_yes),
      btts_no:               num(odds.btts_no),
      open_home:             num(odds.open_home),
      public_pct_home:       num(odds.public_pct_home),
      money_pct_home:        num(odds.money_pct_home),
    }
  };
}

// ─── NBA ─────────────────────────────────────────────────────────────────────

function buildNBA(home, away, odds, ctx) {
  return {
    sport: 'NBA',
    home: {
      team:                  str(home.team),
      net_rtg_l10:           num(home.net_rtg_l10),
      ortg_l10:              num(home.ortg_l10),
      drtg_l10:              num(home.drtg_l10),
      efg_pct:               num(home.efg_pct),
      pace:                  num(home.pace),
      ats_record_l15:        str(home.ats_record_l15),       // "9-6"
      back_to_back:          bool(home.back_to_back),
      minutes_star_l7:       num(home.minutes_star_l7),
      star_player:           str(home.star_player),
      star_vorp:             num(home.star_vorp),
      injuries:              arr(home.injuries),
      record_l10:            str(home.record_l10),
      playoff_position:      num(home.playoff_position),
      h2h_season_wins:       num(home.h2h_season_wins),
    },
    away: {
      team:                  str(away.team),
      net_rtg_l10:           num(away.net_rtg_l10),
      ortg_l10:              num(away.ortg_l10),
      drtg_l10:              num(away.drtg_l10),
      efg_pct:               num(away.efg_pct),
      pace:                  num(away.pace),
      ats_record_l15:        str(away.ats_record_l15),
      back_to_back:          bool(away.back_to_back),
      minutes_star_l7:       num(away.minutes_star_l7),
      star_player:           str(away.star_player),
      star_vorp:             num(away.star_vorp),
      injuries:              arr(away.injuries),
      record_l10:            str(away.record_l10),
      playoff_position:      num(away.playoff_position),
      h2h_season_wins:       num(away.h2h_season_wins),
    },
    context: {
      travel_timezone_diff:  num(ctx.travel_timezone_diff) ?? 0,
      season_stage:          str(ctx.season_stage) ?? 'regular',
    },
    odds: {
      home_spread:           num(odds.home_spread),          // -8.5
      spread_juice_home:     num(odds.spread_juice_home) ?? -110,
      spread_juice_away:     num(odds.spread_juice_away) ?? -110,
      total_line:            num(odds.total_line),
      over_juice:            num(odds.over_juice) ?? -110,
      under_juice:           num(odds.under_juice) ?? -110,
      home_ml:               num(odds.home_ml),
      away_ml:               num(odds.away_ml),
      open_spread:           num(odds.open_spread),
      public_pct_home_spread: num(odds.public_pct_home_spread),
      money_pct_home_spread:  num(odds.money_pct_home_spread),
    }
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function num(v)  { return (v !== undefined && v !== null && !isNaN(v)) ? Number(v) : null; }
function str(v)  { return (v !== undefined && v !== null) ? String(v) : null; }
function arr(v)  { return Array.isArray(v) ? v : []; }
function bool(v) { return v === true || v === 'true' ? true : v === false || v === 'false' ? false : null; }
