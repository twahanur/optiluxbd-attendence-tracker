import { useState, useCallback } from "react";
import { AttendanceRecord, AbsentEmployee } from "./schemas";

export function useReportHandlers(
  attendanceData: AttendanceRecord[],
  absentData: AbsentEmployee[]
) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = useCallback(async () => {
    setIsGenerating(true);
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a simple text-based report for demo
      const reportData = {
        date: new Date().toISOString().split('T')[0],
        attendance: attendanceData.length,
        absent: absentData.length,
        total: attendanceData.length + absentData.length,
        rate: attendanceData.length + absentData.length > 0 
          ? ((attendanceData.length / (attendanceData.length + absentData.length)) * 100).toFixed(1)
          : '0'
      };

      const content = `Attendance Report - ${reportData.date}
      
Present: ${reportData.attendance}
Absent: ${reportData.absent}
Total Employees: ${reportData.total}
Attendance Rate: ${reportData.rate}%

Generated on: ${new Date().toLocaleString()}`;

      // Create and download the file
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance-report-${reportData.date}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [attendanceData, absentData]);

  const handleDownloadCSV = useCallback(() => {
    try {
      // Create CSV content
      const headers = ['Employee Name', 'Employee ID', 'Department', 'Status', 'Check In', 'Check Out'];
      const csvContent = [
        headers.join(','),
        ...attendanceData.map(record => [
          record.employeeName,
          record.employeeId,
          record.department,
          record.status,
          record.checkInTime,
          record.checkOutTime || 'N/A'
        ].join(',')),
        ...absentData.map(record => [
          record.employeeName,
          record.employeeId,
          record.department,
          'absent',
          'N/A',
          'N/A'
        ].join(','))
      ].join('\n');

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance-data-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  }, [attendanceData, absentData]);

  const handleDownloadExcel = useCallback(async () => {
    setIsGenerating(true);
    try {
      // Simulate Excel generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo, we'll create a CSV with Excel-like formatting
      const content = `Attendance Report\nDate: ${new Date().toLocaleDateString()}\n\nEmployee Name,Employee ID,Department,Status,Check In,Check Out\n` +
        attendanceData.map(record => 
          `${record.employeeName},${record.employeeId},${record.department},${record.status},${record.checkInTime},${record.checkOutTime || 'N/A'}`
        ).join('\n') + '\n' +
        absentData.map(record =>
          `${record.employeeName},${record.employeeId},${record.department},absent,N/A,N/A`
        ).join('\n');

      const blob = new Blob([content], { type: 'application/vnd.ms-excel' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance-report-${new Date().toISOString().split('T')[0]}.xls`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error generating Excel:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [attendanceData, absentData]);

  return {
    handleDownloadPDF,
    handleDownloadCSV,
    handleDownloadExcel,
    isGenerating
  };
}
