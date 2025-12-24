import * as React from "react";
import { IconDownload, IconCalendar, IconUsers, IconFileText } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AttendanceRecord, AbsentEmployee } from "./schemas";
import { useReportHandlers } from "./use-report-handlers";

interface ReportsTabProps {
  attendanceDataState: AttendanceRecord[];
  absentDataState: AbsentEmployee[];
}

export function ReportsTab({ attendanceDataState, absentDataState }: ReportsTabProps) {
  const { 
    handleDownloadPDF, 
    handleDownloadCSV, 
    handleDownloadExcel,
    isGenerating 
  } = useReportHandlers(attendanceDataState, absentDataState);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Reports & Export</h2>
        <Select defaultValue="today">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Quick Export Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-10 w-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <IconFileText className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium text-white">PDF Report</h3>
              <p className="text-sm text-white/60">Formatted report with charts</p>
            </div>
          </div>
          <Button 
            className="w-full" 
            variant="outline"
            onClick={handleDownloadPDF}
            disabled={isGenerating}
          >
            <IconDownload className="mr-2 h-4 w-4" />
            {isGenerating ? "Generating..." : "Download PDF"}
          </Button>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-10 w-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <IconUsers className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <h3 className="font-medium text-white">CSV Export</h3>
              <p className="text-sm text-white/60">Raw data for analysis</p>
            </div>
          </div>
          <Button 
            className="w-full" 
            variant="outline"
            onClick={handleDownloadCSV}
            disabled={isGenerating}
          >
            <IconDownload className="mr-2 h-4 w-4" />
            {isGenerating ? "Exporting..." : "Export CSV"}
          </Button>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-10 w-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <IconCalendar className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-medium text-white">Excel Report</h3>
              <p className="text-sm text-white/60">Spreadsheet with formulas</p>
            </div>
          </div>
          <Button 
            className="w-full" 
            variant="outline"
            onClick={handleDownloadExcel}
            disabled={isGenerating}
          >
            <IconDownload className="mr-2 h-4 w-4" />
            {isGenerating ? "Creating..." : "Download Excel"}
          </Button>
        </div>
      </div>

      {/* Report Summary */}
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">Report Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">{attendanceDataState.length}</p>
            <p className="text-sm text-white/60">Present Today</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-400">{absentDataState.length}</p>
            <p className="text-sm text-white/60">Absent Today</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400">
              {attendanceDataState.length + absentDataState.length}
            </p>
            <p className="text-sm text-white/60">Total Employees</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-400">
              {attendanceDataState.length + absentDataState.length > 0 
                ? Math.round((attendanceDataState.length / (attendanceDataState.length + absentDataState.length)) * 100)
                : 0}%
            </p>
            <p className="text-sm text-white/60">Attendance Rate</p>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">Recent Reports</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-white/10">
            <div>
              <p className="font-medium text-white">Daily Attendance Report</p>
              <p className="text-sm text-white/60">Generated 2 hours ago</p>
            </div>
            <Button variant="ghost" size="sm">
              <IconDownload className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-white/10">
            <div>
              <p className="font-medium text-white">Weekly Summary</p>
              <p className="text-sm text-white/60">Generated yesterday</p>
            </div>
            <Button variant="ghost" size="sm">
              <IconDownload className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-white">Monthly Analytics</p>
              <p className="text-sm text-white/60">Generated 3 days ago</p>
            </div>
            <Button variant="ghost" size="sm">
              <IconDownload className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}