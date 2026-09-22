import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const envEmail = process.env.ADMIN_EMAIL || 'info@zynthexion.com';
    const envPassword = process.env.ADMIN_PASSWORD || '4731@Sailor';

    if (email === envEmail && password === envPassword) {
      return NextResponse.json({
        success: true,
        message: 'Authentication successful',
        token: `auth_thanal_admin_${Date.now()}`
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid admin email or password' },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Login failed due to server error' },
      { status: 500 }
    );
  }
}
