// ============================================
// AUTH SERVICE
// ============================================
export {
  loginUser,
  getCurrentUser,
  logout,
  forgotPassword,
  verifyResetToken,
  resetPassword,
  changePassword,
  getProfile,
  updateProfile,
  createEmployee as createEmployeeAuth,
} from "./auth";

export type {
  TLoginData,
  UserData,
  LoginResponse,
  ForgotPasswordRequest,
  VerifyResetTokenRequest,
  ResetPasswordRequest,
  ChangePasswordRequest as AuthChangePasswordRequest,
  UpdateProfileRequest as AuthUpdateProfileRequest,
  CreateEmployeeRequest as AuthCreateEmployeeRequest,
} from "./auth";

// ============================================
// PROFILE SERVICE
// ============================================
export {
  getUserProfile,
  updateUserProfile,
  changePassword as changeProfilePassword,
} from "./profile";

export type {
  UserProfile,
  UpdateProfileRequest,
  ChangePasswordRequest,
  ApiResponse,
} from "./profile";

// ============================================
// ATTENDANCE SERVICE
// ============================================
export {
  // New API methods
  markAttendance,
  markAbsence,
  updateAttendance,
  getMyAttendanceRecords,
  getCurrentMonthSummary,
  getMonthSummary,
  getTodayAttendance,
  getDateAttendance,
  getAttendanceStats,
  getAttendanceChart,
  deleteAttendance,
  
  // Legacy aliases (deprecated)
  checkIn,
  checkOut,
  getCurrentAttendanceStatus,
  getAttendanceRecords,
  getAttendanceReport,
} from "./attendence";

export type {
  MoodType,
  ShiftType,
  AttendanceStatusType,
  AttendanceRecord,
  MarkAttendanceRequest,
  MarkAbsenceRequest,
  UpdateAttendanceRequest,
  AttendanceSummary,
  AttendanceStats,
  TodayAttendance,
  PaginationInfo,
  AttendanceRecordsResponse,
} from "./attendence";

// ============================================
// REPORTS SERVICE
// ============================================
export {
  GetDailyReport,
  GetDailyReportPDF,
  GetWeeklyReport,
  GetWeeklyReportPDF,
  GetMonthlyReport,
  GetMonthlyReportPDF,
  GetEmployeeReport,
  GetDepartmentReport,
  GetDepartmentReportPDF,
  GetAttendanceSummary,
  GetDayWiseAttendance,
  downloadPDFReport,
  reportsApi,
} from "./reports";

export type {
  DailyReport,
  WeeklyReport,
  MonthlyReport,
  EmployeeReport,
  DepartmentReport,
  AttendanceSummary as ReportAttendanceSummary,
  DayWiseAttendance,
} from "./reports";
