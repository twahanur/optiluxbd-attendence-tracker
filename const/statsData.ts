type TStats = {
  totalAttendanceDays: number;
  currentMonthAttendance: {
    totalDays: number;
    attendedDays: number;
    attendancePercentage: number;
    month: string;
    year: number;
    moodDistribution: Record<string, number>;
    shiftDistribution: Record<string, number>;
  };
};

export const mockAttendanceStats: TStats = {
  totalAttendanceDays: 87,

  currentMonthAttendance: {
    totalDays: 31,
    attendedDays: 22,
    attendancePercentage: 71,
    month: "2025-12",
    year: 2025,

    moodDistribution: {
      EXCELLENT: 9,
      GOOD: 7,
      AVERAGE: 4,
      POOR: 1,
      TERRIBLE: 1,
    },

    shiftDistribution: {
      MORNING: 10,
      AFTERNOON: 6,
      EVENING: 4,
      NIGHT: 2,
    },
  },
};
