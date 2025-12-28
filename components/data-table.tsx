"use client";

import * as React from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconLayoutColumns,
  IconPlus,
} from "@tabler/icons-react";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";

import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import our modular components
import { AttendanceRecord, AbsentEmployee } from "./data-table/schemas";
import { attendanceColumns } from "./data-table/attendance-columns";
import { absentEmployeeColumns } from "./data-table/absent-employee-columns";
import { AttendanceDraggableRow } from "./data-table/attendance-draggable-row";
import { AbsentEmployeeDraggableRow } from "./data-table/absent-employee-draggable-row";
import { AnalyticsTab } from "./data-table/analytics-tab";
import { ReportsTab } from "./data-table/reports-tab";

interface DataTableProps {
  data: {
    recentAttendances?: AttendanceRecord[];
    notAttendedEmployees?: AbsentEmployee[];
  };
  isLoading?: boolean;
}

export function DataTable({
  data: attendanceData,
  isLoading = false,
}: DataTableProps) {
  console.log("DataTable received data:", attendanceData);
  console.log("Is Loading:", isLoading);

  const attendanceRecords = React.useMemo(() => {
    const records = attendanceData?.recentAttendances || [];
    console.log("Raw Attendance Records:", records);
    return records;
  }, [attendanceData?.recentAttendances]);

  const absentEmployees = React.useMemo(() => {
    const employees = attendanceData?.notAttendedEmployees || [];
    console.log("🔍 Raw Absent Employees Count:", employees.length);
    console.log("🔍 Raw Absent Employees Sample:", employees.slice(0, 2));

    // Transform the API data to match our schema
    const transformedEmployees = employees.map(
      (
        emp: {
          firstName: string;
          lastName: string;
          avatar?: string;
          [key: string]: unknown;
        },
        index: number,
      ) => {
        const transformed = {
          ...emp,
          employeeName: `${emp.firstName} ${emp.lastName}`,
          avatar: emp.avatar || "/placeholder-avatar.png",
          reason: emp.reason || "Not specified",
          date: new Date().toISOString().split("T")[0],
        };

        if (index < 2) {
          console.log(`🔍 Transformed Employee ${index}:`, transformed);
        }

        return transformed;
      },
    );

    console.log(
      "🎯 Total Transformed Absent Employees:",
      transformedEmployees.length,
    );
    return transformedEmployees;
  }, [attendanceData?.notAttendedEmployees]);

  const [attendanceDataState, setAttendanceDataState] =
    React.useState(attendanceRecords);
  const [absentDataState, setAbsentDataState] = React.useState(absentEmployees);

  React.useEffect(() => {
    console.log("🔄 Setting attendanceDataState:", attendanceRecords.length);
    setAttendanceDataState(attendanceRecords);
  }, [attendanceRecords]);

  React.useEffect(() => {
    console.log("🔄 Setting absentDataState:", absentEmployees.length);
    setAbsentDataState(absentEmployees);
  }, [absentEmployees]);

  const [attendanceColumnVisibility, setAttendanceColumnVisibility] =
    React.useState<VisibilityState>({});
  const [absentColumnVisibility, setAbsentColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 50, // Increased from 10 to 50 to show more employees by default
  });

  const sortableId = React.useId();
  const isMobile = useIsMobile();

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  const attendanceDataIds = React.useMemo<UniqueIdentifier[]>(
    () => attendanceDataState?.map(({ id }) => id),
    [attendanceDataState],
  );

  const absentDataIds = React.useMemo<UniqueIdentifier[]>(
    () => absentDataState?.map(({ id }) => id),
    [absentDataState],
  );

  // Attendance table
  const attendanceTable = useReactTable({
    data: attendanceDataState,
    columns: attendanceColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setAttendanceColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onPaginationChange: setPagination,
    getRowId: (row) => row.id,
    state: {
      sorting,
      columnFilters,
      columnVisibility: attendanceColumnVisibility,
      rowSelection,
      pagination,
    },
  });

  // Absent employees table
  const absentTable = useReactTable({
    data: absentDataState,
    columns: absentEmployeeColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setAbsentColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onPaginationChange: setPagination,
    getRowId: (row) => row.id,
    state: {
      sorting,
      columnFilters,
      columnVisibility: absentColumnVisibility,
      rowSelection,
      pagination,
    },
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      // Check if it's attendance or absent employee data
      const isAttendance = attendanceDataIds.includes(active.id);

      if (isAttendance) {
        setAttendanceDataState((data) => {
          const oldIndex = attendanceDataIds.indexOf(active.id);
          const newIndex = attendanceDataIds.indexOf(over.id);
          return arrayMove(data, oldIndex, newIndex);
        });
      } else {
        setAbsentDataState((data) => {
          const oldIndex = absentDataIds.indexOf(active.id);
          const newIndex = absentDataIds.indexOf(over.id);
          return arrayMove(data, oldIndex, newIndex);
        });
      }
    }
  }

  if (isLoading) {
    return (
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="text-white/70 text-lg">Loading attendance data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show data summary for debugging
  const totalAttendance = attendanceDataState.length;
  const totalAbsent = absentDataState.length;
  console.log(
    `Data Summary - Attendance: ${totalAttendance}, Absent: ${totalAbsent}`,
  );

  // Debug table states
  console.log(
    "🔍 Absent Table Rows:",
    absentTable.getRowModel().rows?.length || 0,
  );
  console.log(
    "🔍 Absent Table Data Sample:",
    absentTable.getRowModel().rows?.slice(0, 2) || [],
  );
  console.log("🔍 absentDataState Sample:", absentDataState.slice(0, 2));

  return (
    <div className="space-y-4">
      {/* Debug Info - Remove in production */}
      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 text-white/70 text-sm">
        <p>
          📊 Data Status: {totalAttendance} present, {totalAbsent} absent
        </p>
        {totalAttendance === 0 && totalAbsent === 0 && (
          <p className="text-yellow-400 mt-2">
            ⚠️ No data available. Check API connection.
          </p>
        )}
      </div>

      <Tabs
        defaultValue="outline"
        className="w-full flex-col justify-start gap-6">
        <div className="flex items-center justify-between px-4 lg:px-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-150">
            <TabsTrigger value="outline">Attendance</TabsTrigger>
            <TabsTrigger value="solid">Absent</TabsTrigger>
            <TabsTrigger value="key-personnel">Analytics</TabsTrigger>
            <TabsTrigger value="focus-documents">Reports</TabsTrigger>
          </TabsList>

          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search employees..."
              value={
                (attendanceTable
                  .getColumn("employeeName")
                  ?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                attendanceTable
                  .getColumn("employeeName")
                  ?.setFilterValue(event.target.value)
              }
              className="h-8 w-37.5 lg:w-62.5"
            />
            {isMobile ? (
              <Drawer>
                <DrawerTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto h-8 hidden lg:flex">
                    <IconLayoutColumns className="mr-2 h-4 w-4" />
                    View
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                      <DrawerTitle>Toggle columns</DrawerTitle>
                      <DrawerDescription>
                        Choose which columns to display in the table.
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 pb-0">
                      <div className="space-y-2">
                        {attendanceTable
                          .getAllColumns()
                          .filter(
                            (column) =>
                              typeof column.accessorFn !== "undefined" &&
                              column.getCanHide(),
                          )
                          .map((column) => {
                            return (
                              <div
                                key={column.id}
                                className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  className="rounded border border-primary"
                                  checked={column.getIsVisible()}
                                  onChange={(e) =>
                                    column.toggleVisibility(e.target.checked)
                                  }
                                />
                                <Label
                                  htmlFor={column.id}
                                  className="text-sm font-normal">
                                  {column.id}
                                </Label>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                    <DrawerFooter>
                      <DrawerClose asChild>
                        <Button variant="outline">Close</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </div>
                </DrawerContent>
              </Drawer>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto h-8 hidden lg:flex">
                    <IconLayoutColumns className="mr-2 h-4 w-4" />
                    View
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-37.5">
                  {attendanceTable
                    .getAllColumns()
                    .filter(
                      (column) =>
                        typeof column.accessorFn !== "undefined" &&
                        column.getCanHide(),
                    )
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value: boolean) =>
                            column.toggleVisibility(!!value)
                          }>
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button size="sm" className="h-8">
              <IconPlus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </div>
        </div>

        {/* Attendance Tab */}
        <TabsContent
          value="outline"
          className="flex flex-col space-y-4 px-4 lg:px-6">
          <DndContext
            id={sortableId}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}>
            <div className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    {attendanceTable.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {attendanceTable.getRowModel().rows?.length ? (
                      <SortableContext
                        items={attendanceDataIds}
                        strategy={verticalListSortingStrategy}>
                        {attendanceTable.getRowModel().rows.map((row) => (
                          <AttendanceDraggableRow key={row.id} row={row} />
                        ))}
                      </SortableContext>
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={attendanceColumns.length}
                          className="h-24 text-center">
                          No results.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                  {attendanceTable.getFilteredSelectedRowModel().rows.length} of{" "}
                  {attendanceTable.getFilteredRowModel().rows.length} row(s)
                  selected.
                </div>
                <div className="flex items-center space-x-6 lg:space-x-8">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <Select
                      value={`${
                        attendanceTable.getState().pagination.pageSize
                      }`}
                      onValueChange={(value: string) => {
                        attendanceTable.setPageSize(Number(value));
                      }}>
                      <SelectTrigger className="h-8 w-[70px]">
                        <SelectValue
                          placeholder={
                            attendanceTable.getState().pagination.pageSize
                          }
                        />
                      </SelectTrigger>
                      <SelectContent side="top">
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                          <SelectItem key={pageSize} value={`${pageSize}`}>
                            {pageSize}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex w-25 items-center justify-center text-sm font-medium">
                    Page {attendanceTable.getState().pagination.pageIndex + 1}{" "}
                    of {attendanceTable.getPageCount()}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      className="hidden h-8 w-8 p-0 lg:flex"
                      onClick={() => attendanceTable.setPageIndex(0)}
                      disabled={!attendanceTable.getCanPreviousPage()}>
                      <span className="sr-only">Go to first page</span>
                      <IconChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => attendanceTable.previousPage()}
                      disabled={!attendanceTable.getCanPreviousPage()}>
                      <span className="sr-only">Go to previous page</span>
                      <IconChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => attendanceTable.nextPage()}
                      disabled={!attendanceTable.getCanNextPage()}>
                      <span className="sr-only">Go to next page</span>
                      <IconChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="hidden h-8 w-8 p-0 lg:flex"
                      onClick={() =>
                        attendanceTable.setPageIndex(
                          attendanceTable.getPageCount() - 1,
                        )
                      }
                      disabled={!attendanceTable.getCanNextPage()}>
                      <span className="sr-only">Go to last page</span>
                      <IconChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DndContext>
        </TabsContent>

        {/* Absent Employees Tab */}
        <TabsContent
          value="solid"
          className="flex flex-col space-y-4 px-4 lg:px-6">
          <DndContext
            id={`${sortableId}-absent`}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}>
            <div className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    {absentTable.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {absentTable.getRowModel().rows?.length ? (
                      <SortableContext
                        items={absentDataIds}
                        strategy={verticalListSortingStrategy}>
                        {absentTable.getRowModel().rows.map((row) => (
                          <AbsentEmployeeDraggableRow key={row.id} row={row} />
                        ))}
                      </SortableContext>
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={absentEmployeeColumns.length}
                          className="h-24 text-center">
                          No absent employees today.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination for Absent Table */}
              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                  {absentTable.getFilteredSelectedRowModel().rows.length} of{" "}
                  {absentTable.getFilteredRowModel().rows.length} row(s)
                  selected.
                </div>
                <div className="flex items-center space-x-6 lg:space-x-8">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <Select
                      value={`${absentTable.getState().pagination.pageSize}`}
                      onValueChange={(value: string) => {
                        absentTable.setPageSize(Number(value));
                      }}>
                      <SelectTrigger className="h-8 w-[70px]">
                        <SelectValue
                          placeholder={
                            absentTable.getState().pagination.pageSize
                          }
                        />
                      </SelectTrigger>
                      <SelectContent side="top">
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                          <SelectItem key={pageSize} value={`${pageSize}`}>
                            {pageSize}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex w-25 items-center justify-center text-sm font-medium">
                    Page {absentTable.getState().pagination.pageIndex + 1} of{" "}
                    {absentTable.getPageCount()}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      className="hidden h-8 w-8 p-0 lg:flex"
                      onClick={() => absentTable.setPageIndex(0)}
                      disabled={!absentTable.getCanPreviousPage()}>
                      <span className="sr-only">Go to first page</span>
                      <IconChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => absentTable.previousPage()}
                      disabled={!absentTable.getCanPreviousPage()}>
                      <span className="sr-only">Go to previous page</span>
                      <IconChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => absentTable.nextPage()}
                      disabled={!absentTable.getCanNextPage()}>
                      <span className="sr-only">Go to next page</span>
                      <IconChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="hidden h-8 w-8 p-0 lg:flex"
                      onClick={() =>
                        absentTable.setPageIndex(absentTable.getPageCount() - 1)
                      }
                      disabled={!absentTable.getCanNextPage()}>
                      <span className="sr-only">Go to last page</span>
                      <IconChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DndContext>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent
          value="key-personnel"
          className="flex flex-col px-4 lg:px-6">
          <AnalyticsTab
            attendanceDataState={attendanceDataState}
            absentDataState={absentDataState}
          />
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent
          value="focus-documents"
          className="flex flex-col px-4 lg:px-6">
          <ReportsTab
            attendanceDataState={attendanceDataState}
            absentDataState={absentDataState}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}