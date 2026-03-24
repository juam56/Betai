
import { buildGamePayload } from '../lib/buildGamePayload.js';
import { getSystemPrompt } from '../lib/systemPrompts.js';
import { parseOdds } from '../lib/oddsParser.js';

export const config = { maxDuration: 30 };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { game_id, sport, home, away, odds, context } = req.body;

  if (!sport || !home || !away || !odds) {
    return res.status(400).json({
      error: 'Missing required fields: sport, home, away, odds'
    });
  }

  const sportUpper = sport.toUpperCase();
  if (!['MLB', 'SOCCER', 'NBA'].includes(sportUpper)) {
    return res.status(400).json({ error: 'Sport must be MLB, SOCCER or NBA' });
  }

  try {
    // 1. Construir payload estructurado
    const gamePayload = buildGamePayload({ sport: sportUpper, home, away, odds, context });

    // 2. Obtener system prompt para el deporte
    const systemPrompt = getSystemPrompt(sportUpper);

    // 3. Llamar a Claude
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
        messages: [
          { role: 'user', content: JSON.stringify(gamePayload) }
        ]
      })
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      console.error('Anthropic API error:', errText);
      return res.status(502).json({ error: 'AI service error', details: errText });
    }

    const anthropicData = await anthropicRes.json();
    const rawText = anthropicData.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('');

    // 4. Parsear JSON de respuesta
    let prediction;
    try {
      const clean = rawText.replace(/```json|```/g, '').trim();
      prediction = JSON.parse(clean);
    } catch {
      return res.status(502).json({ error: 'Failed to parse AI response', raw: rawText });
    }

    // 5. Enriquecer con metadatos
    const enriched = {
      game_id: game_id || `${sportUpper}-${Date.now()}`,
      sport: sportUpper,
      analyzed_at: new Date().toISOString(),
      matchup: `${away.team} @ ${home.team}`,
      prediction,
      input_summary: {
        home_team: home.team,
        away_team: away.team,
        odds_snapshot: parseOdds(odds, sportUpper)
      }
    };

    return res.status(200).json(enriched);

  } catch (err) {
    console.error('predict handler error:', err);
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
}
