import { z } from "zod";

export const attendanceSchema = z.object({
  id: z.string(),
  employeeName: z.string(),
  employeeId: z.string(),
  department: z.string(),
  section: z.string(),
  shift: z.string().optional(),
  mood: z.string().optional(),
  checkInTime: z.string(),
  checkOutTime: z.string().nullable(),
  status: z.enum(["present", "absent", "late", "halfDay"]),
  duration: z.string().optional(),
  notes: z.string().optional(),
  avatar: z.string().optional(),
  position: z.string().optional(),
  location: z.string().optional(),
  date: z.string().optional(),
  createdAt: z.string().optional(),
});

// Updated schema to match API response structure
export const absentEmployeeSchema = z.object({
  id: z.string(),
  email: z.string(),
  username: z.string(),
  role: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  employeeId: z.string(),
  section: z.string(),
  department: z.string(),
  designation: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  address: z.string().nullable(),
  dateOfJoining: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  createdBy: z.string().nullable(),
  // Computed fields
  employeeName: z.string().optional(),
  avatar: z.string().optional(),
  reason: z.string().optional(),
  date: z.string().optional(),
});

export const schema = attendanceSchema;

export type AttendanceRecord = z.infer<typeof attendanceSchema>;
export type AbsentEmployee = z.infer<typeof absentEmployeeSchema>;