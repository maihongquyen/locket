export default async function handler(req, res) {
  // Chỉ cho phép phương thức POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;
  const API_KEY = 'AIzaSyCQngaaXQlfjaH0aS2l7REgljD7nL431So'; // Key bạn vừa bắt được
  const AUTH_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;

  try {
    const response = await fetch(AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Server giả mạo hoàn toàn các thông số của app Locket trên iPhone
        'X-Ios-Bundle-Identifier': 'com.locket.Locket',
        'X-Client-Version': 'iOS/FirebaseSDK/10.23.1/FirebaseCore-iOS',
        'User-Agent': 'FirebaseAuth.iOS/10.23.1 com.locket.Locket/2.8.0 iPhone/16.0'
      },
      body: JSON.stringify({ email, password, returnSecureToken: true })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Lỗi xác thực từ Firebase');
    }
    
    // Trả token về cho giao diện web của bạn
    res.status(200).json(data);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
