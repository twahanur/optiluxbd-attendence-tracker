import { ColumnDef } from "@tanstack/react-table";
import { IconCircleCheckFilled, IconGripVertical } from "@tabler/icons-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AttendanceRecord } from "./schemas";

function DragHandle({ id }: { id: string }) {
  return (
    <IconGripVertical
      size={16}
      className="cursor-grab text-muted-foreground active:cursor-grabbing"
      data-id={id}
    />
  );
}

export const attendanceColumns: ColumnDef<AttendanceRecord>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-0.5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-0.5"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  },
  {
    id: "dragHandle",
    header: "",
    cell: ({ row }) => <DragHandle id={row.original.id} />,
    enableSorting: false,
    enableHiding: false,
    size: 40,
  },
  {
    accessorKey: "employeeName",
    header: "Employee",
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        {row.original.avatar && (
          <Image
            src={row.original.avatar}
            alt={row.original.employeeName}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover"
          />
        )}
        <div>
          <div className="font-medium">{row.original.employeeName}</div>
          <div className="text-sm text-muted-foreground">
            ID: {row.original.employeeId}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => (
      <Badge variant="secondary">{row.getValue("department")}</Badge>
    ),
  },
  {
    accessorKey: "position",
    header: "Position",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusColors = {
        present: "bg-green-100 text-green-800",
        late: "bg-yellow-100 text-yellow-800",
        absent: "bg-red-100 text-red-800",
        halfDay: "bg-blue-100 text-blue-800",
      };

      return (
        <div className="flex items-center space-x-1">
          {status === "present" && (
            <IconCircleCheckFilled size={14} className="text-green-600" />
          )}
          <Badge
            className={statusColors[status as keyof typeof statusColors]}
            variant="secondary">
            {status}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "checkInTime",
    header: "Check In",
    cell: ({ row }) => {
      const time = new Date(row.original.checkInTime).toLocaleTimeString(
        "en-US",
        {
          hour: "2-digit",
          minute: "2-digit",
        },
      );
      return <span className="font-mono text-sm">{time}</span>;
    },
  },
  {
    accessorKey: "checkOutTime",
    header: "Check Out",
    cell: ({ row }) => {
      const checkOutTime = row.original.checkOutTime;
      if (!checkOutTime)
        return <span className="text-muted-foreground">—</span>;

      const time = new Date(checkOutTime).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return <span className="font-mono text-sm">{time}</span>;
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.getValue("duration")}</span>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <span className="text-sm">{row.getValue("location")}</span>
    ),
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => (
      <span className="max-w-32 truncate text-sm text-muted-foreground">
        {row.original.notes || "—"}
      </span>
    ),
  },
];