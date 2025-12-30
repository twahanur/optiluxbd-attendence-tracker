"use client";

import { useState } from "react";
import { SettingsManager, CompanySettingsManager, EmailSettingsManager, UserSettingsManager, EmployeeManagement } from "@/components/admin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("company");

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Settings Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage all system configurations and settings</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-5">
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="user">User Settings</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        {/* Company Settings */}
        <TabsContent value="company" className="mt-8">
          <Card className="p-6">
            <CompanySettingsManager />
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="mt-8">
          <Card className="p-6">
            <EmailSettingsManager />
          </Card>
        </TabsContent>

        {/* User Settings */}
        <TabsContent value="user" className="mt-8">
          <Card className="p-6">
            <UserSettingsManager />
          </Card>
        </TabsContent>

        {/* Employee Management */}
        <TabsContent value="employees" className="mt-8">
          <EmployeeManagement />
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="mt-8">
          <Card className="p-6">
            <SettingsManager />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
