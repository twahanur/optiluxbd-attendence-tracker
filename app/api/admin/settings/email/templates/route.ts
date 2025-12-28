import { NextResponse } from 'next/server';

// Mock email templates data
const emailTemplates = {
  attendanceReminder: {
    subject: '🕐 Attendance Reminder - Please Mark Your Attendance',
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Attendance Reminder</h2>
      <p>Dear {{employeeName}},</p>
      <p>This is a friendly reminder to mark your attendance for <strong>{{date}}</strong>.</p>
      <p>Please log into the attendance system and mark your attendance as soon as possible.</p>
      <hr style="border: 1px solid #eee; margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">
        Best regards,<br>
        {{companyName}} HR Department
      </p>
    </div>`,
    text: 'Dear {{employeeName}}, This is a reminder to mark your attendance for {{date}}. Please log into the system and mark your attendance. Best regards, {{companyName}}',
    variables: ['employeeName', 'date', 'companyName']
  },
  passwordReset: {
    subject: '🔐 Password Reset Request for Your Account',
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p>Hello {{userName}},</p>
      <p>We received a request to reset your password. Click the link below to reset it:</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="{{resetLink}}" style="background: #007cba; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Reset Password</a>
      </p>
      <p style="color: #666; font-size: 14px;">
        This link will expire in {{expiryTime}}. If you didn't request this, please ignore this email.
      </p>
    </div>`,
    text: 'Hello {{userName}}, We received a request to reset your password. Use this link: {{resetLink}}. Link expires in {{expiryTime}}.',
    variables: ['userName', 'resetLink', 'expiryTime']
  },
  dailyReport: {
    subject: '📊 Daily Attendance Report - {{date}}',
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Daily Attendance Report</h2>
      <p>Date: <strong>{{date}}</strong></p>
      <p>Total Employees: {{totalEmployees}}</p>
      <p>Present: {{presentCount}}</p>
      <p>Absent: {{absentCount}}</p>
      <p>Attendance Rate: {{attendanceRate}}%</p>
    </div>`,
    text: 'Daily Attendance Report for {{date}}. Total: {{totalEmployees}}, Present: {{presentCount}}, Absent: {{absentCount}}, Rate: {{attendanceRate}}%',
    variables: ['date', 'totalEmployees', 'presentCount', 'absentCount', 'attendanceRate']
  }
};

// GET /api/admin/settings/email/templates
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      message: 'Email templates retrieved',
      data: {
        templates: emailTemplates,
        count: Object.keys(emailTemplates).length
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve email templates',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}