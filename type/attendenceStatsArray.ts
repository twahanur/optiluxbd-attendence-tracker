import { AbsentEmployee } from "../components/data-table/schemas";
import { AttendanceRecord } from "../components/data-table/schemas";

type Role = "EMPLOYEE" | "ADMIN";

export type TEmployee = {
  id: string;
  employeeId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  department: string;
  section: string;
  designation?: string;
  role: Role;
  phoneNumber?: string;
  address?: string;
  dateOfJoining?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
};

export type TStatsArray = {
  attendancePercentageToday: number;
  notAttendedEmployees: AbsentEmployee[];
  recentAttendances: AttendanceRecord[];
  totalAttendedToday: number;
  totalEmployees: number;
  totalNotAttendedToday: number;
};
