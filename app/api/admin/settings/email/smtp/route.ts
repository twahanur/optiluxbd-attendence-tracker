import { NextRequest, NextResponse } from 'next/server';

// Mock SMTP configuration
let smtpConfig = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  user: 'system@optiluxbd.com',
  pass: '***hidden***',
  from: 'OptiluxBD Attendance <noreply@optiluxbd.com>',
  isConfigured: true
};

// GET /api/admin/settings/email/smtp
export async function GET() {
  try {
    // Return SMTP config with password hidden
    const safeConfig = {
      ...smtpConfig,
      pass: smtpConfig.pass ? '***hidden***' : ''
    };

    return NextResponse.json({
      success: true,
      message: 'SMTP configuration retrieved',
      data: {
        smtp: safeConfig
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve SMTP configuration',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT /api/admin/settings/email/smtp
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { host, port, secure, user, pass, from } = body;

    if (!host || !port || user === undefined || pass === undefined || !from) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: host, port, user, pass, from'
      }, { status: 400 });
    }

    // Update SMTP configuration
    smtpConfig = {
      host,
      port: parseInt(port.toString()),
      secure: Boolean(secure),
      user,
      pass,
      from,
      isConfigured: true
    };

    return NextResponse.json({
      success: true,
      message: 'SMTP configuration updated successfully',
      data: {
        smtp: {
          ...smtpConfig,
          pass: '***hidden***' // Hide password in response
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to update SMTP configuration',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}