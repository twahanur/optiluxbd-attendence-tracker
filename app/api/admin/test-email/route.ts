import { NextRequest, NextResponse } from 'next/server';

// POST /api/admin/test-email
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, subject, message } = body;

    if (!email || !subject || !message) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: email, subject, message'
      }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid email address format'
      }, { status: 400 });
    }

    // Simulate sending email
    // In real app, this would use the configured SMTP settings
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate occasional failures for realism
    const shouldFail = Math.random() < 0.1; // 10% chance of failure

    if (shouldFail) {
      return NextResponse.json({
        success: false,
        message: 'Failed to send test email',
        error: 'SMTP connection timeout'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      data: {
        recipient: email,
        subject: subject,
        sentAt: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to send test email',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}