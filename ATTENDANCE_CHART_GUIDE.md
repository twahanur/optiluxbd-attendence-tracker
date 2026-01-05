# Attendance Chart Implementation Guide

## Overview
The `AttendanceChartInteractive` component displays attendance trends over time with an interactive area chart.

## Data Requirements

### TypeScript Interface
```typescript
export interface AttendanceChartData {
  date: string;      // Format: "2026-01-01" (YYYY-MM-DD)
  present: number;   // Number of employees present
  absent: number;    // Number of employees absent
  late: number;      // Number of employees who arrived late
  total: number;     // Total number of employees
}
```

### Example Data
```typescript
const chartData: AttendanceChartData[] = [
  {
    date: "2026-01-01",
    present: 32,
    absent: 2,
    late: 1,
    total: 35
  },
  {
    date: "2026-01-02",
    present: 30,
    absent: 3,
    late: 2,
    total: 35
  },
  // ... more days
];
```

## Backend API Implementation

### API Endpoint
```
GET /api/v1/attendance/chart
```

### Query Parameters
- `days` (optional): Number of days to retrieve (default: 90)

### Expected Response Format
```json
{
  "success": true,
  "message": "Attendance chart data retrieved successfully",
  "data": {
    "chartData": [
      {
        "date": "2025-10-03",
        "present": 28,
        "absent": 5,
        "late": 2,
        "total": 35
      },
      {
        "date": "2025-10-04",
        "present": 30,
        "absent": 3,
        "late": 2,
        "total": 35
      }
    ]
  },
  "timestamp": "2026-01-01T10:00:00.000Z"
}
```

## Usage

### Basic Usage (With Demo Data)
```tsx
import { AttendanceChartInteractive } from "@/components/attendance-chart-interactive";

export default function DashboardPage() {
  return (
    <div>
      {/* Uses built-in demo data */}
      <AttendanceChartInteractive />
    </div>
  );
}
```

### With Real Data
```tsx
import { AttendanceChartInteractive, AttendanceChartData } from "@/components/attendance-chart-interactive";

async function getChartData(): Promise<AttendanceChartData[]> {
  const response = await fetch('/api/v1/attendance/chart?days=90');
  const result = await response.json();
  return result.data.chartData;
}

export default async function DashboardPage() {
  const chartData = await getChartData();
  
  return (
    <div>
      <AttendanceChartInteractive data={chartData} />
    </div>
  );
}
```

## Features

### 1. Time Range Selection
- Last 7 days
- Last 30 days
- Last 90 days (3 months)

### 2. Responsive Design
- Desktop: Toggle buttons for time range
- Mobile: Dropdown selector
- Automatically switches to 7-day view on mobile

### 3. Interactive Tooltip
Shows detailed information when hovering over the chart:
- Date (formatted)
- Present employees count
- Late employees count
- Absent employees count

### 4. Color Coding
- **Green**: Present employees
- **Yellow/Orange**: Late employees
- **Red**: Absent employees

### 5. Statistics Summary
- Average daily attendance
- Overall attendance rate percentage

## Backend Implementation Example

### Prisma Query (Node.js)
```typescript
async function getAttendanceChartData(days: number = 90) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const totalEmployees = await prisma.user.count({
    where: {
      role: 'EMPLOYEE',
      isActive: true
    }
  });

  const attendanceRecords = await prisma.$queryRaw`
    SELECT 
      DATE(createdAt) as date,
      COUNT(CASE WHEN status = 'present' THEN 1 END) as present,
      COUNT(CASE WHEN status = 'absent' THEN 1 END) as absent,
      COUNT(CASE WHEN status = 'late' THEN 1 END) as late,
      ${totalEmployees} as total
    FROM attendance
    WHERE createdAt >= ${startDate}
    GROUP BY DATE(createdAt)
    ORDER BY date ASC
  `;

  return {
    success: true,
    message: "Attendance chart data retrieved successfully",
    data: {
      chartData: attendanceRecords.map(record => ({
        date: record.date.toISOString().split('T')[0],
        present: Number(record.present),
        absent: Number(record.absent),
        late: Number(record.late),
        total: Number(record.total)
      }))
    }
  };
}
```

## Integration Steps

1. **Create the API endpoint** (backend)
   - Implement the endpoint to fetch daily attendance data
   - Aggregate data by date
   - Return in the specified format

2. **Create a service function** (frontend)
   ```typescript
   // service/attendance/getChartData.ts
   export async function getAttendanceChartData(days: number = 90) {
     const res = await fetch(`/api/v1/attendance/chart?days=${days}`);
     const result = await res.json();
     return result.data.chartData;
   }
   ```

3. **Update the dashboard page**
   ```tsx
   import { getAttendanceChartData } from "@/service/attendance/getChartData";
   
   const chartData = await getAttendanceChartData(90);
   
   <AttendanceChartInteractive data={chartData} />
   ```

## Demo Mode

The component includes built-in demo data generation. If no data is provided, it will automatically generate 90 days of realistic demo data for testing.

## Current Implementation

✅ Component created: `components/attendance-chart-interactive.tsx`
✅ Integrated in: `component/home/adminHomePage/AdminHomePage.tsx`
✅ Currently showing: **Demo data** (realistic simulation)
⏳ Next step: Connect to backend API

---

## Quick Test

The chart is already visible on your dashboard with demo data. You can test the time range filters:
- Click "Last 3 months" / "Last 30 days" / "Last 7 days"
- Hover over the chart to see detailed tooltips
- The chart automatically adjusts to mobile devices
