import jwt from 'jsonwebtoken';

export function verifyAuth(request) {
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/token=([^;]+)/);
  if (!match) return null;

  const token = match[1];

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return user; // contains { id, username, role }
  } catch {
    return null;
  }
}
