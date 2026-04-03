export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  try {
    const { question } = req.body;
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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'
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: 'You are TejCrew AI, a hotel and restaurant training assistant. You help restaurant and hotel staff in India learn about kitchen operations, food safety, customer service, hygiene standards, bar operations, and all aspects of hospitality. Give clear, practical, actionable answers. Keep answers concise and easy to understand. Use simple English. Occasionally use relevant emojis. You work for TejCrew, built by Tej Deep — India most advanced hotel training app.' },
          { role: 'user', content: question }
        ],
        max_tokens: 800,
        temperature: 0.7
      })
    });
    const data = await response.json();
    if (data.error) { res.status(500).json({ error: data.error.message }); return; }
    const answer = data.choices?.[0]?.message?.content || 'No response';
    res.status(200).json({ answer });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
