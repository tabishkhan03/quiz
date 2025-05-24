// src/pages/api/auth/me.js (or /app/api/auth/me/route.js in app router)

import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  try {
    const cookie = req.headers.get('cookie') || '';
    const tokenCookie = cookie.split('; ').find(c => c.startsWith('token='));
    if (!tokenCookie) {
      return new Response(JSON.stringify({ loggedIn: false }), { status: 200, headers: { 'Content-Type': 'application/json' }});
    }

    const token = tokenCookie.split('=')[1];
    const decoded = jwt.verify(token, SECRET);

    return new Response(JSON.stringify({ loggedIn: true, user: { id: decoded.id, username: decoded.username, role: decoded.role } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ loggedIn: false }), { status: 200, headers: { 'Content-Type': 'application/json' }});
  }
}
