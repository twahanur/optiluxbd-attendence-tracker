import { NextRequest, NextResponse } from 'next/server';

// Mock password policy
let passwordPolicy = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSymbols: true,
  preventCommonPasswords: true,
  preventUserInfo: true,
  expirationDays: 90,
  historyCount: 5
};

// GET /api/admin/user-settings/password-policy
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      message: 'Password policy retrieved',
      data: {
        passwordPolicy: passwordPolicy
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve password policy',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT /api/admin/user-settings/password-policy
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields and ranges
    if (typeof body.minLength !== 'number' || body.minLength < 1 || body.minLength > 50) {
      return NextResponse.json({
        success: false,
        message: 'minLength must be a number between 1 and 50'
      }, { status: 400 });
    }

    if (typeof body.maxLength !== 'number' || body.maxLength < body.minLength || body.maxLength > 256) {
      return NextResponse.json({
        success: false,
        message: 'maxLength must be a number greater than minLength and less than 256'
      }, { status: 400 });
    }

    // Update password policy
    passwordPolicy = {
      minLength: body.minLength,
      maxLength: body.maxLength,
      requireUppercase: Boolean(body.requireUppercase),
      requireLowercase: Boolean(body.requireLowercase),
      requireNumbers: Boolean(body.requireNumbers),
      requireSymbols: Boolean(body.requireSymbols),
      preventCommonPasswords: Boolean(body.preventCommonPasswords),
      preventUserInfo: Boolean(body.preventUserInfo),
      expirationDays: parseInt(body.expirationDays) || 0,
      historyCount: parseInt(body.historyCount) || 0
    };

    return NextResponse.json({
      success: true,
      message: 'Password policy updated successfully',
      data: {
        passwordPolicy: passwordPolicy
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to update password policy',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}