
import { buildGamePayload } from '../lib/buildGamePayload.js';
import { getSystemPrompt } from '../lib/systemPrompts.js';

export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { games } = req.body;

  if (!Array.isArray(games) || games.length === 0) {
    return res.status(400).json({ error: 'Body must include a "games" array' });
  }

  if (games.length > 10) {
    return res.status(400).json({ error: 'Maximum 10 games per batch request' });
  }

  const results = await Promise.allSettled(
    games.map(game => analyzeGame(game))
  );

  const response = results.map((result, i) => {
    if (result.status === 'fulfilled') {
      return { index: i, status: 'ok', data: result.value };
    }
    return {
      index: i,
      status: 'error',
      game_id: games[i].game_id ?? null,
      error: result.reason?.message ?? 'Unknown error'
    };
  });

  const successCount = response.filter(r => r.status === 'ok').length;

  return res.status(200).json({
    total: games.length,
    success: successCount,
    failed: games.length - successCount,
    results: response
  });
}

async function analyzeGame({ game_id, sport, home, away, odds, context = {} }) {
  if (!sport || !home || !away || !odds) {
    throw new Error('Missing required fields: sport, home, away, odds');
  }

  const sportUpper = sport.toUpperCase();
  const gamePayload = buildGamePayload({ sport: sportUpper, home, away, odds, context });
  const systemPrompt = getSystemPrompt(sportUpper);

  const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: 'user', content: JSON.stringify(gamePayload) }]
    })
  });

  if (!anthropicRes.ok) {
    throw new Error(`Anthropic API error: ${anthropicRes.status}`);
  }

  const anthropicData = await anthropicRes.json();
  const rawText = anthropicData.content
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('');

  const clean = rawText.replace(/```json|```/g, '').trim();
  const prediction = JSON.parse(clean);

  return {
    game_id: game_id ?? `${sportUpper}-${Date.now()}`,
    sport: sportUpper,
    analyzed_at: new Date().toISOString(),
    matchup: `${away.team} @ ${home.team}`,
    prediction
  };
}
