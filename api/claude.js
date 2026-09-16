// Keeps the Anthropic key on the server. The browser never sees it.
export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Use POST' });
  }

  // Optional shared passcode. Set APP_PASSCODE in Vercel to switch it on.
  const gate = process.env.APP_PASSCODE;
  if (gate && req.headers['x-passcode'] !== gate) {
    return res.status(401).json({ error: 'Wrong passcode' });
  }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY is not set on the server' });
  }

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    });

    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (err) {
    return res.status(502).json({ error: 'Could not reach the model', detail: String(err) });
  }
}
