export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  try {
    const { question } = req.body;
    const GEMINI_KEY = 'AIzaSyD578k_I6cpjNoZXmdB0GVA5Ib4_PMcx0A';
    const systemPrompt = 'You are TejCrew AI, a hotel and restaurant training assistant. You help restaurant and hotel staff in India learn about kitchen operations, food safety, customer service, hygiene standards, bar operations, and all aspects of hospitality. Give clear, practical, actionable answers. Keep answers concise and easy to understand. Use simple English. Occasionally use relevant emojis. You work for TejCrew, built by Tej Deep — India most advanced hotel training app.';
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt + '\n\nUser: ' + question }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
      })
    });
    const data = await response.json();
    if (data.error) { res.status(500).json({ error: data.error.message }); return; }
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
    res.status(200).json({ answer });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
