import { z } from "zod";

export const attendanceSchema = z.object({
  id: z.string(),
  employeeName: z.string(),
  employeeId: z.string(),
  department: z.string(),
  checkInTime: z.string(),
  checkOutTime: z.string().nullable(),
  status: z.enum(["present", "absent", "late", "halfDay"]),
  duration: z.string(),
  notes: z.string().optional(),
  avatar: z.string().optional(),
  position: z.string(),
  location: z.string(),
});

export const absentEmployeeSchema = z.object({
  id: z.string(),
  employeeName: z.string(),
  employeeId: z.string(),
  department: z.string(),
  position: z.string(),
  reason: z.string().optional(),
  date: z.string(),
  avatar: z.string().optional(),
  contactInfo: z.string().optional(),
});

export const schema = attendanceSchema;

export type AttendanceRecord = z.infer<typeof attendanceSchema>;
export type AbsentEmployee = z.infer<typeof absentEmployeeSchema>;