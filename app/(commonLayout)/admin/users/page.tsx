'use client';

import { EmployeeManagement } from '@/components/admin';

export default function AdminUsersPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-gray-600 mt-2">Manage all employees and users in the system</p>
      </div>
      
      <EmployeeManagement />
    </div>
  );
}
