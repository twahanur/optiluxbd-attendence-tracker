/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';

// Mock settings data - this would come from database in real app
const getSettingsByCategory = (category: string) => {
  const allSettings = [
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
    }
  ];

  return allSettings.filter(setting => setting.category === category);
};

// GET /api/admin/settings/category/[category] - Get settings by category
export async function GET(
  request: NextRequest,
  { params }: { params: any }
) {
  try {
    const category = params.category;
    
    if (!category) {
      return NextResponse.json({
        success: false,
        message: 'Category parameter is required'
      }, { status: 400 });
    }

    const settings = getSettingsByCategory(category);

    return NextResponse.json({
      success: true,
      message: 'Category settings retrieved',
      data: {
        category: category,
        settings: settings.map(s => ({
          key: s.key,
          value: s.value,
          description: s.description
        })),
        count: settings.length
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve category settings',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}