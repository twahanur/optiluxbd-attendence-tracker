import { NextRequest, NextResponse } from 'next/server';

// Common passwords list (simplified)
const commonPasswords = [
  'password', '123456', 'password123', 'admin', 'qwerty',
  '123456789', '12345', '1234567890', 'abc123', 'Password1'
];

// Password validation function
function validatePassword(password: string, userInfo?: { email?: string; name?: string }) {
  const requirements = {
    minLength: false,
    maxLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumbers: false,
    hasSymbols: false,
    notCommon: false,
    notUserInfo: false
  };

  let score = 0;
  const suggestions: string[] = [];

  // Mock policy (in real app, get from database)
  const policy = {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: true,
    preventCommonPasswords: true,
    preventUserInfo: true
  };

  // Check length
  if (password.length >= policy.minLength) {
    requirements.minLength = true;
    score += 15;
  } else {
    suggestions.push(`Password must be at least ${policy.minLength} characters long`);
  }

  if (password.length <= policy.maxLength) {
    requirements.maxLength = true;
    score += 5;
  } else {
    suggestions.push(`Password must not exceed ${policy.maxLength} characters`);
  }

  // Check character requirements
  if (policy.requireUppercase && /[A-Z]/.test(password)) {
    requirements.hasUppercase = true;
    score += 15;
  } else if (policy.requireUppercase) {
    suggestions.push('Password must contain at least one uppercase letter');
  }

  if (policy.requireLowercase && /[a-z]/.test(password)) {
    requirements.hasLowercase = true;
    score += 15;
  } else if (policy.requireLowercase) {
    suggestions.push('Password must contain at least one lowercase letter');
  }

  if (policy.requireNumbers && /[0-9]/.test(password)) {
    requirements.hasNumbers = true;
    score += 15;
  } else if (policy.requireNumbers) {
    suggestions.push('Password must contain at least one number');
  }

  if (policy.requireSymbols && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    requirements.hasSymbols = true;
    score += 20;
  } else if (policy.requireSymbols) {
    suggestions.push('Password must contain at least one special character');
  }

  // Check common passwords
  if (policy.preventCommonPasswords && !commonPasswords.includes(password.toLowerCase())) {
    requirements.notCommon = true;
    score += 10;
  } else if (policy.preventCommonPasswords) {
    suggestions.push('Password is too common. Please choose a more unique password');
  }

  // Check user info
  let containsUserInfo = false;
  if (userInfo && policy.preventUserInfo) {
    const lowerPassword = password.toLowerCase();
    if (userInfo.email) {
      const emailParts = userInfo.email.toLowerCase().split('@')[0];
      if (lowerPassword.includes(emailParts)) {
        containsUserInfo = true;
      }
    }
    if (userInfo.name) {
      const nameParts = userInfo.name.toLowerCase().split(' ');
      nameParts.forEach(part => {
        if (part.length > 2 && lowerPassword.includes(part)) {
          containsUserInfo = true;
        }
      });
    }

    if (!containsUserInfo) {
      requirements.notUserInfo = true;
      score += 5;
    } else {
      suggestions.push('Password should not contain personal information');
    }
  } else {
    requirements.notUserInfo = true;
    score += 5;
  }

  const isValid = Object.values(requirements).every(req => req);

  return {
    isValid,
    score: Math.min(score, 100),
    requirements,
    suggestions
  };
}

// POST /api/admin/user-settings/password-policy/validate
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, userInfo } = body;

    if (!password) {
      return NextResponse.json({
        success: false,
        message: 'Password is required'
      }, { status: 400 });
    }

    const result = validatePassword(password, userInfo);

    return NextResponse.json({
      success: true,
      message: 'Password validation completed',
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to validate password',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}