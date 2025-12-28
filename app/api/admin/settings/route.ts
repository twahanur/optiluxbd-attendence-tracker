import { NextRequest, NextResponse } from 'next/server';

// Mock database - in real app, use your actual database
const settings = [
  {
    id: 1,
    key: 'company.name',
    value: 'Optilux BD',
    category: 'company',
    description: 'Company name for branding',
    createdAt: '2025-12-28T09:00:00.000Z',
    updatedAt: '2025-12-28T10:00:00.000Z'
  },
  {
    id: 2,
    key: 'company.address',
    value: 'Dhaka, Bangladesh',
    category: 'company',
    description: 'Company physical address',
    createdAt: '2025-12-28T09:00:00.000Z',
    updatedAt: '2025-12-28T10:00:00.000Z'
  },
  {
    id: 3,
    key: 'system.timezone',
    value: 'Asia/Dhaka',
    category: 'system',
    description: 'System default timezone',
    createdAt: '2025-12-28T09:00:00.000Z',
    updatedAt: '2025-12-28T10:00:00.000Z'
  },
  {
    id: 4,
    key: 'email.enabled',
    value: 'true',
    category: 'email',
    description: 'Enable email notifications',
    createdAt: '2025-12-28T09:00:00.000Z',
    updatedAt: '2025-12-28T10:00:00.000Z'
  }
];

// GET /api/admin/settings - Get all settings
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');

    let filteredSettings = settings;
    if (category) {
      filteredSettings = settings.filter(setting => setting.category === category);
    }

    const categories = [...new Set(settings.map(s => s.category))];

    return NextResponse.json({
      success: true,
      message: 'Settings retrieved successfully',
      data: {
        settings: filteredSettings,
        total: filteredSettings.length,
        categories: categories
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve settings',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST /api/admin/settings - Create new setting
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, value, category, description } = body;

    if (!key || !value || !category) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: key, value, category'
      }, { status: 400 });
    }

    // Check if setting already exists
    const existing = settings.find(s => s.key === key);
    if (existing) {
      return NextResponse.json({
        success: false,
        message: 'Setting with this key already exists'
      }, { status: 409 });
    }

    const newSetting = {
      id: Math.max(...settings.map(s => s.id)) + 1,
      key,
      value,
      category,
      description: description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    settings.push(newSetting);

    return NextResponse.json({
      success: true,
      message: 'Setting created successfully',
      data: {
        setting: newSetting
      },
      timestamp: new Date().toISOString()
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to create setting',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT /api/admin/settings/bulk - Bulk update settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { settings: updateSettings } = body;

    if (!Array.isArray(updateSettings)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid request body. Expected settings array.'
      }, { status: 400 });
    }

    const updatedCount = updateSettings.length;
    const now = new Date().toISOString();

    updateSettings.forEach(updateSetting => {
      const index = settings.findIndex(s => s.key === updateSetting.key);
      if (index !== -1) {
        settings[index] = {
          ...settings[index],
          ...updateSetting,
          updatedAt: now
        };
      }
    });

    return NextResponse.json({
      success: true,
      message: `${updatedCount} settings updated successfully`,
      data: {
        updatedCount
      },
      timestamp: now
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to bulk update settings',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}