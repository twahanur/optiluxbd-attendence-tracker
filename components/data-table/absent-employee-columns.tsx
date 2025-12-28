import { ColumnDef } from "@tanstack/react-table";
import { IconGripVertical } from "@tabler/icons-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AbsentEmployee } from "./schemas";

function DragHandle({ id }: { id: string }) {
  return (
    <IconGripVertical
      size={16}
      className="cursor-grab text-muted-foreground active:cursor-grabbing"
      data-id={id}
    />
  );
}

export const absentEmployeeColumns: ColumnDef<AbsentEmployee>[] = [
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
            alt={row.original.employeeName ?? 'avatar'}
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
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.reason || "Not specified"}
      </span>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = row.original.date
        ? new Date(row.original.date).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })
        : "N/A";
      return <span className="font-mono text-sm">{date}</span>;
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Contact",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.phoneNumber || "N/A"}
      </span>
    ),
  },
];