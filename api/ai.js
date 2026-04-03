export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  try {
    const { question } = req.body;
    const GEMINI_KEY = 'AIzaSyD578k_I6cpjNoZXmdB0GVA5Ib4_PMcx0A';
    const systemPrompt = 'You are TejCrew AI, a hotel and restaurant training assistant. Help hotel staff in India with kitchen operations, food safety, customer service, hygiene, bar operations. Give clear practical answers in simple English with emojis. Built by Tej Deep.';
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + GEMINI_KEY, {
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
