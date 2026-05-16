const API_KEY = 'AIzaSyCQngaaXQlfjaH0aS2l7REgljD7nL431So'; 

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { action, email, password, url, method, headers, body } = req.body;

  if (action === 'login') {
    try {
      const authRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Ios-Bundle-Identifier': 'com.locket.Locket',
          'X-Client-Version': 'iOS/FirebaseSDK/10.23.1/FirebaseCore-iOS',
          'User-Agent': 'FirebaseAuth.iOS/10.23.1 com.locket.Locket/2.8.0 iPhone/16.0'
        },
        body: JSON.stringify({ email, password, returnSecureToken: true })
      });
      const data = await authRes.json();
      if (!authRes.ok) return res.status(authRes.status).json({ error: data.error?.message || 'Sai tài khoản hoặc mật khẩu' });
      return res.status(200).json(data);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (action === 'proxy') {
    try {
      let requestBody = body;
      
      if (body && typeof body === 'object' && body.type === 'Base64') {
        requestBody = Buffer.from(body.data, 'base64');
      } else if (body && typeof body === 'object') {
        requestBody = JSON.stringify(body);
      }

      const response = await fetch(url, {
        method: method || 'POST',
        headers: {
          ...headers,
          'User-Agent': 'com.locket.Locket/2.8.0 iPhone/16.0',
          'X-Ios-Bundle-Identifier': 'com.locket.Locket'
        },
        body: requestBody
      });

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return res.status(response.status).json(data);
      } else {
        const text = await response.text();
        return res.status(response.status).send(text);
      }
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(400).json({ error: 'Invalid action' });
}
