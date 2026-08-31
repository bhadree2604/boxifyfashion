export async function POST(request) {
  const { password } = await request.json();

  const gatePassword = process.env.ADMIN_GATE_PASSWORD;

  if (!gatePassword) {
    return new Response(
      JSON.stringify({ valid: false, error: 'Admin gate password not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const isValid = password === gatePassword;

  return new Response(
    JSON.stringify({ valid: isValid }),
    {
      headers: { 'Content-Type': 'application/json' },
      status: isValid ? 200 : 401,
    }
  );
}