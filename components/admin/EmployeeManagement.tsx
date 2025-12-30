"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle,
  Search,
} from "lucide-react";
import {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  type CreateEmployeeRequest,
  type EmployeeResponse,
} from "@/service/admin";

export default function EmployeeManagement() {
  // State management
  const [employees, setEmployees] = useState<EmployeeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState<CreateEmployeeRequest>({
    email: "",
    name: "",
    department: "",
    section: "",
    password: "",
    role: "EMPLOYEE",
  });

  // Fetch employees on mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Fetch all employees
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await getAllEmployees();
      if (response.success && response.data) {
        setEmployees(response.data.employees || []);
        toast.success("Employees loaded successfully");
      } else {
        toast.error(response.message || "Failed to load employees");
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
      toast.error(err instanceof Error ? err.message : "Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  // Open create dialog
  const handleCreate = () => {
    setIsEditMode(false);
    setSelectedEmployee(null);
    setFormData({
      email: "",
      name: "",
      department: "",
      section: "",
      password: "",
      role: "EMPLOYEE",
    });
    setIsDialogOpen(true);
  };

  // Open edit dialog
  const handleEdit = (employee: EmployeeResponse) => {
    setIsEditMode(true);
    setSelectedEmployee(employee);
    setFormData({
      email: employee.email,
      name: employee.name,
      department: employee.department,
      section: employee.section || "",
      password: "", // Password field empty for edit
      role: employee.role as "ADMIN" | "EMPLOYEE" | "HR",
    });
    setIsDialogOpen(true);
  };

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate form
  const validateForm = (): boolean => {
    if (!formData.email || !formData.name || !formData.department) {
      toast.error("Email, name, and department are required");
      return false;
    }

    if (!isEditMode && !formData.password) {
      toast.error("Password is required for new employees");
      return false;
    }

    if (!isEditMode && formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  // Save employee (create or update)
  const handleSaveEmployee = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (isEditMode && selectedEmployee) {
        // Update employee
        const updateData: Partial<CreateEmployeeRequest> = {
          name: formData.name,
          department: formData.department,
          section: formData.section,
          role: formData.role,
        };

        if (formData.password) {
          updateData.password = formData.password;
        }

        const response = await updateEmployee(selectedEmployee.id, updateData);

        if (response.success) {
          setEmployees((prev) =>
            prev.map((emp) =>
              emp.id === selectedEmployee.id
                ? { ...emp, ...updateData }
                : emp
            )
          );
          toast.success("Employee updated successfully");
          setIsDialogOpen(false);
        } else {
          toast.error(response.message || "Failed to update employee");
        }
      } else {
        // Create employee
        const response = await createEmployee(formData as CreateEmployeeRequest);

        if (response.success && response.data && 'employee' in response.data) {
          setEmployees((prev) => [...prev, (response.data as { employee: EmployeeResponse }).employee]);
          toast.success("Employee created successfully");
          setIsDialogOpen(false);
        } else {
          toast.error(response.message || "Failed to create employee");
        }
      }
    } catch (err) {
      console.error("Error saving employee:", err);
      toast.error(err instanceof Error ? err.message : "Failed to save employee");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete employee
  const handleDeleteEmployee = async (id: number) => {
    setIsSubmitting(true);
    try {
      const response = await deleteEmployee(id);

      if (response.success) {
        setEmployees((prev) => prev.filter((emp) => emp.id !== id));
        toast.success("Employee deleted successfully");
        setDeleteConfirmId(null);
      } else {
        toast.error(response.message || "Failed to delete employee");
      }
    } catch (err) {
      console.error("Error deleting employee:", err);
      toast.error(err instanceof Error ? err.message : "Failed to delete employee");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter employees based on search
  const filteredEmployees = employees.filter((emp) =>
    (emp.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (emp.email?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (emp.department?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Employee Management</CardTitle>
              <CardDescription>
                Create, update, and manage employee accounts
              </CardDescription>
            </div>
            <Button onClick={handleCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Employee
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employees Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Employees</CardTitle>
          <CardDescription>
            {filteredEmployees.length} of {employees.length} employees
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredEmployees.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {employees.length === 0
                  ? "No employees found. Create one to get started."
                  : "No employees match your search criteria."}
              </AlertDescription>
            </Alert>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{employee.section || "-"}</TableCell>
                      <TableCell>
                        <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                          {employee.role}
                        </span>
                      </TableCell>
                      <TableCell>
                        {employee.isActive ? (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            Active
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-gray-600">
                            <AlertCircle className="h-4 w-4" />
                            Inactive
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(employee)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setDeleteConfirmId(employee.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Sheet */}
      <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>
              {isEditMode ? "Edit Employee" : "Create New Employee"}
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="employee@example.com"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isEditMode}
              />
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            {/* Department */}
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                name="department"
                placeholder="IT, HR, Sales, etc."
                value={formData.department}
                onChange={handleInputChange}
              />
            </div>

            {/* Section */}
            <div className="space-y-2">
              <Label htmlFor="section">Section (Optional)</Label>
              <Input
                id="section"
                name="section"
                placeholder="e.g., Backend Team"
                value={formData.section}
                onChange={handleInputChange}
              />
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="EMPLOYEE">Employee</option>
                <option value="HR">HR Manager</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">
                Password
                {isEditMode && (
                  <span className="text-sm text-gray-500 ml-2">(Leave empty to keep current)</span>
                )}
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder={isEditMode ? "Leave empty to keep current" : "Enter password"}
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <SheetFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEmployee} disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEditMode ? "Update" : "Create"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Sheet */}
      <Sheet open={deleteConfirmId !== null}>
        <SheetContent className="w-full sm:max-w-sm">
          <SheetHeader>
            <SheetTitle>Delete Employee</SheetTitle>
          </SheetHeader>

          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              Are you sure you want to delete this employee? This action cannot be undone.
            </AlertDescription>
          </Alert>

          <SheetFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmId(null)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirmId && handleDeleteEmployee(deleteConfirmId)}
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
