import { NextResponse } from 'next/server';

// Mock email system status
const emailSystemStatus = {
  isConfigured: true,
  smtpStatus: 'connected' as const,
  lastTestTime: '2025-12-28T09:00:00.000Z',
  activeJobs: [
    {
      name: 'Daily Attendance Reminder',
      schedule: '0 13 * * 1-5',
      nextRun: '2025-12-29T13:00:00.000Z',
      status: 'active' as const
    },
    {
      name: 'Weekly Report',
      schedule: '0 9 * * 1',
      nextRun: '2025-12-30T09:00:00.000Z',
      status: 'active' as const
    },
    {
      name: 'Daily Absentee Report',
      schedule: '0 18 * * 1-5',
      nextRun: '2025-12-28T18:00:00.000Z',
      status: 'active' as const
    }
  ],
  emailsSentToday: 45,
  failedEmailsToday: 2
};

// GET /api/admin/email-status
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      message: 'Email system status retrieved',
      data: {
        emailSystem: emailSystemStatus
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve email system status',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}