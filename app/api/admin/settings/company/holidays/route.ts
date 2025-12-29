import { NextRequest, NextResponse } from 'next/server';

// Mock holidays data
const holidays = [
  {
    id: 1,
    name: 'New Year\'s Day',
    date: '2025-01-01',
    type: 'public' as const,
    description: 'New Year celebration'
  },
  {
    id: 2,
    name: 'International Mother Language Day',
    date: '2025-02-21',
    type: 'public' as const,
    description: 'Language Martyrs Day'
  },
  {
    id: 3,
    name: 'Independence Day',
    date: '2025-03-26',
    type: 'public' as const,
    description: 'National Independence Day'
  },
  {
    id: 4,
    name: 'Victory Day',
    date: '2025-12-16',
    type: 'public' as const,
    description: 'Victory Day of Bangladesh'
  },
  {
    id: 5,
    name: 'Company Foundation Day',
    date: '2025-06-15',
    type: 'private' as const,
    description: 'OptiluxBD founding anniversary'
  }
];

// GET /api/admin/settings/company/holidays
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const year = url.searchParams.get('year');
    
    let filteredHolidays = holidays;
    if (year) {
      filteredHolidays = holidays.filter(holiday => 
        new Date(holiday.date).getFullYear() === parseInt(year)
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Holidays retrieved',
      data: {
        holidays: filteredHolidays,
        total: filteredHolidays.length,
        year: year ? parseInt(year) : new Date().getFullYear()
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve holidays',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST /api/admin/settings/company/holidays
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, date, type, description } = body;

    if (!name || !date || !type) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: name, date, type'
      }, { status: 400 });
    }

    if (!['public', 'private'].includes(type)) {
      return NextResponse.json({
        success: false,
        message: 'Type must be either "public" or "private"'
      }, { status: 400 });
    }

    // Check if holiday already exists on the same date
    const existingHoliday = holidays.find(h => h.date === date);
    if (existingHoliday) {
      return NextResponse.json({
        success: false,
        message: 'A holiday already exists on this date'
      }, { status: 409 });
    }

    const newHoliday = {
      id: Math.max(...holidays.map(h => h.id)) + 1,
      name,
      date,
      type: type as 'public' | 'private',
      description: description || ''
    };

    holidays.push(newHoliday);

    return NextResponse.json({
      success: true,
      message: 'Holiday added successfully',
      data: {
        holiday: newHoliday
      },
      timestamp: new Date().toISOString()
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to add holiday',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}