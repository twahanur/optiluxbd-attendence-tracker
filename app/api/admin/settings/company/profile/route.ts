import { NextRequest, NextResponse } from 'next/server';

// Mock company profile data
let companyProfile = {
  name: 'Optilux BD',
  address: 'House #123, Road #456, Dhaka-1000, Bangladesh',
  phone: '+880-2-123456789',
  email: 'info@optiluxbd.com',
  website: 'https://www.optiluxbd.com',
  industry: 'Technology',
  description: 'Leading attendance tracking solution provider in Bangladesh',
  logo: 'https://via.placeholder.com/200x100/0066cc/ffffff?text=OptiluxBD'
};

// GET /api/admin/settings/company/profile - Get company profile
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      message: 'Company profile retrieved',
      data: {
        profile: companyProfile
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve company profile',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT /api/admin/settings/company/profile - Update company profile
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.address || !body.phone || !body.email) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: name, address, phone, email'
      }, { status: 400 });
    }

    // Update company profile
    companyProfile = {
      ...companyProfile,
      ...body
    };

    return NextResponse.json({
      success: true,
      message: 'Company profile updated successfully',
      data: {
        profile: companyProfile
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to update company profile',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}