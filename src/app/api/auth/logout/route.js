export async function POST() {
  return new Response(JSON.stringify({ message: 'Logged out' }), {
    status: 200,
    headers: {
      'Set-Cookie': 'token=; Path=/; Max-Age=0',
      'Content-Type': 'application/json',
    },
  });
}
