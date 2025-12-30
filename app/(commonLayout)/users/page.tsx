'use client';

import { EmployeeManagement } from '@/components/admin';

export default function UsersPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Employees</h1>
        <p className="text-gray-600 mt-2">View and manage all employees</p>
      </div>
      
      <EmployeeManagement />
    </div>
  );
}
