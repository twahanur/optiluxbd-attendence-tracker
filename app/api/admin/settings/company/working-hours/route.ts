import { NextRequest, NextResponse } from 'next/server';

// Mock working hours data
let workingHours = {
  monday: { start: '09:00', end: '17:00', isWorkingDay: true },
  tuesday: { start: '09:00', end: '17:00', isWorkingDay: true },
  wednesday: { start: '09:00', end: '17:00', isWorkingDay: true },
  thursday: { start: '09:00', end: '17:00', isWorkingDay: true },
  friday: { start: '09:00', end: '17:00', isWorkingDay: true },
  saturday: { start: '09:00', end: '13:00', isWorkingDay: false },
  sunday: { start: '00:00', end: '00:00', isWorkingDay: false },
  timezone: 'Asia/Dhaka',
  lunchBreakStart: '12:00',
  lunchBreakEnd: '13:00'
};

// GET /api/admin/settings/company/working-hours
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      message: 'Working hours retrieved',
      data: {
        workingHours: workingHours
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve working hours',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT /api/admin/settings/company/working-hours
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the structure
    const requiredDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const hasAllDays = requiredDays.every(day => 
      body[day] && 
      typeof body[day].start === 'string' && 
      typeof body[day].end === 'string' && 
      typeof body[day].isWorkingDay === 'boolean'
    );

    if (!hasAllDays || !body.timezone || !body.lunchBreakStart || !body.lunchBreakEnd) {
      return NextResponse.json({
        success: false,
        message: 'Invalid working hours structure. All days, timezone, and lunch break times are required.'
      }, { status: 400 });
    }

    // Update working hours
    workingHours = { ...body };

    return NextResponse.json({
      success: true,
      message: 'Working hours updated successfully',
      data: {
        workingHours: workingHours
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to update working hours',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}