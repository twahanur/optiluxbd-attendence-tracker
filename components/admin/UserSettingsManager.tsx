"use client";

import { useEffect, useState } from "react";
import {
  getPasswordPolicy,
  updatePasswordPolicy,
  getRegistrationPolicy,
  updateRegistrationPolicy,
  getLockoutRules,
  updateLockoutRules,
  createEmployee,
  getAllEmployees,
  deleteEmployee,
  type PasswordPolicy,
  type RegistrationPolicy,
  type LockoutRules,
  type CreateEmployeeRequest,
  type EmployeeResponse,
} from "@/service/admin/user-settings";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function UserSettingsManager() {
  const [passwordPolicy, setPasswordPolicy] = useState<PasswordPolicy | null>(null);
  const [registrationPolicy, setRegistrationPolicy] = useState<RegistrationPolicy | null>(null);
  const [lockoutRules, setLockoutRules] = useState<LockoutRules | null>(null);
  const [employees, setEmployees] = useState<EmployeeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingTab, setEditingTab] = useState<string | null>(null);
  const [showAddEmployee, setShowAddEmployee] = useState(false);

  const [newEmployee, setNewEmployee] = useState<CreateEmployeeRequest>({
    email: "",
    name: "",
    department: "",
    section: "",
    password: "",
    role: "EMPLOYEE",
  });

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [policyRes, regRes, lockRes, empRes] = await Promise.all([
          getPasswordPolicy(),
          getRegistrationPolicy(),
          getLockoutRules(),
          getAllEmployees(),
        ]);

        if (policyRes.success && policyRes.data) {
          setPasswordPolicy(policyRes.data.passwordPolicy);
        } else {
          setError(policyRes.message || "Failed to fetch password policy");
        }

        if (regRes.success && regRes.data) {
          setRegistrationPolicy(regRes.data.registrationPolicy);
        }

        if (lockRes.success && lockRes.data) {
          setLockoutRules(lockRes.data.lockoutRules);
        }

        if (empRes.success && empRes.data) {
          setEmployees(empRes.data.employees);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred while fetching user settings");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle password policy update
  const handlePasswordPolicyUpdate = async () => {
    try {
      setError(null);
      if (!passwordPolicy) return;

      const response = await updatePasswordPolicy(passwordPolicy);

      if (response.success) {
        setEditingTab(null);
        setSuccessMessage("Password policy updated successfully");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.message || "Failed to update password policy");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  // Handle registration policy update
  const handleRegistrationPolicyUpdate = async () => {
    try {
      setError(null);
      if (!registrationPolicy) return;

      const response = await updateRegistrationPolicy(registrationPolicy);

      if (response.success) {
        setEditingTab(null);
        setSuccessMessage("Registration policy updated successfully");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.message || "Failed to update registration policy");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  // Handle lockout rules update
  const handleLockoutRulesUpdate = async () => {
    try {
      setError(null);
      if (!lockoutRules) return;

      const response = await updateLockoutRules(lockoutRules);

      if (response.success) {
        setEditingTab(null);
        setSuccessMessage("Lockout rules updated successfully");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.message || "Failed to update lockout rules");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  // Handle create employee
  const handleCreateEmployee = async () => {
    try {
      setError(null);

      if (!newEmployee.email || !newEmployee.name || !newEmployee.password) {
        setError("Please fill in all required fields");
        return;
      }

      const response = await createEmployee(newEmployee);

      if (response.success && response.data) {
        setEmployees([...employees, response.data.employee]);
        setNewEmployee({
          email: "",
          name: "",
          department: "",
          section: "",
          password: "",
          role: "EMPLOYEE",
        });
        setShowAddEmployee(false);
        setSuccessMessage(`Employee created successfully. Temporary password: ${response.data.temporaryPassword}`);
        setTimeout(() => setSuccessMessage(null), 5000);
      } else {
        setError(response.message || "Failed to create employee");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while creating employee");
    }
  };

  // Handle delete employee
  const handleDeleteEmployee = async (id: number) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    try {
      setError(null);
      const response = await deleteEmployee(id);

      if (response.success) {
        setEmployees(employees.filter(e => e.id !== id));
        setSuccessMessage("Employee deleted successfully");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.message || "Failed to delete employee");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while deleting employee");
    }
  };



  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <p className="text-lg text-gray-500">Loading user settings...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="password-policy" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="password-policy">Password Policy</TabsTrigger>
          <TabsTrigger value="registration">Registration Policy</TabsTrigger>
          <TabsTrigger value="lockout">Lockout Rules</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
        </TabsList>

        {/* Password Policy Tab */}
        <TabsContent value="password-policy">
          <Card>
            <CardHeader>
              <CardTitle>Password Policy Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              {passwordPolicy && (
                <div className="space-y-4">
                  {editingTab === "password-policy" ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold mb-2">Min Length</label>
                          <Input
                            type="number"
                            value={passwordPolicy.minLength}
                            onChange={(e) =>
                              setPasswordPolicy({ ...passwordPolicy, minLength: parseInt(e.target.value) })
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2">Max Length</label>
                          <Input
                            type="number"
                            value={passwordPolicy.maxLength}
                            onChange={(e) =>
                              setPasswordPolicy({ ...passwordPolicy, maxLength: parseInt(e.target.value) })
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2">Expiration Days</label>
                          <Input
                            type="number"
                            value={passwordPolicy.expirationDays}
                            onChange={(e) =>
                              setPasswordPolicy({
                                ...passwordPolicy,
                                expirationDays: parseInt(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2">History Count</label>
                          <Input
                            type="number"
                            value={passwordPolicy.historyCount}
                            onChange={(e) =>
                              setPasswordPolicy({ ...passwordPolicy, historyCount: parseInt(e.target.value) })
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold">Requirements</h4>
                        {[
                          { key: "requireUppercase", label: "Require Uppercase Letters" },
                          { key: "requireLowercase", label: "Require Lowercase Letters" },
                          { key: "requireNumbers", label: "Require Numbers" },
                          { key: "requireSymbols", label: "Require Symbols" },
                          { key: "preventCommonPasswords", label: "Prevent Common Passwords" },
                          { key: "preventUserInfo", label: "Prevent User Info in Password" },
                        ].map(({ key, label }) => (
                          <label key={key} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={passwordPolicy[key as keyof PasswordPolicy] as boolean}
                              onChange={(e) =>
                                setPasswordPolicy({
                                  ...passwordPolicy,
                                  [key]: e.target.checked,
                                })
                              }
                              className="mr-3"
                            />
                            {label}
                          </label>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={handlePasswordPolicyUpdate}>Save Policy</Button>
                        <Button variant="outline" onClick={() => setEditingTab(null)}>
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="border rounded p-4">
                          <p className="text-sm text-gray-500">Min Length</p>
                          <p className="text-2xl font-bold">{passwordPolicy.minLength}</p>
                        </div>
                        <div className="border rounded p-4">
                          <p className="text-sm text-gray-500">Max Length</p>
                          <p className="text-2xl font-bold">{passwordPolicy.maxLength}</p>
                        </div>
                        <div className="border rounded p-4">
                          <p className="text-sm text-gray-500">Expiration (Days)</p>
                          <p className="text-2xl font-bold">{passwordPolicy.expirationDays}</p>
                        </div>
                        <div className="border rounded p-4">
                          <p className="text-sm text-gray-500">History Count</p>
                          <p className="text-2xl font-bold">{passwordPolicy.historyCount}</p>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-3">Active Requirements</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { key: "requireUppercase", label: "Uppercase" },
                            { key: "requireLowercase", label: "Lowercase" },
                            { key: "requireNumbers", label: "Numbers" },
                            { key: "requireSymbols", label: "Symbols" },
                            { key: "preventCommonPasswords", label: "No Common Passwords" },
                            { key: "preventUserInfo", label: "No User Info" },
                          ].map(({ key, label }) => (
                            <span
                              key={key}
                              className={`px-3 py-1 rounded text-xs font-semibold ${
                                passwordPolicy[key as keyof PasswordPolicy]
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {label}
                            </span>
                          ))}
                        </div>
                      </div>

                      <Button onClick={() => setEditingTab("password-policy")}>Edit Policy</Button>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Registration Policy Tab */}
        <TabsContent value="registration">
          <Card>
            <CardHeader>
              <CardTitle>Registration Policy Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              {registrationPolicy && (
                <div className="space-y-4">
                  {editingTab === "registration" ? (
                    <>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={registrationPolicy.allowSelfRegistration}
                            onChange={(e) =>
                              setRegistrationPolicy({
                                ...registrationPolicy,
                                allowSelfRegistration: e.target.checked,
                              })
                            }
                            className="mr-3"
                          />
                          Allow Self Registration
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={registrationPolicy.requireEmailVerification}
                            onChange={(e) =>
                              setRegistrationPolicy({
                                ...registrationPolicy,
                                requireEmailVerification: e.target.checked,
                              })
                            }
                            className="mr-3"
                          />
                          Require Email Verification
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={registrationPolicy.requireAdminApproval}
                            onChange={(e) =>
                              setRegistrationPolicy({
                                ...registrationPolicy,
                                requireAdminApproval: e.target.checked,
                              })
                            }
                            className="mr-3"
                          />
                          Require Admin Approval
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={registrationPolicy.autoActivateAccounts}
                            onChange={(e) =>
                              setRegistrationPolicy({
                                ...registrationPolicy,
                                autoActivateAccounts: e.target.checked,
                              })
                            }
                            className="mr-3"
                          />
                          Auto Activate Accounts
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={registrationPolicy.requireInvitation}
                            onChange={(e) =>
                              setRegistrationPolicy({
                                ...registrationPolicy,
                                requireInvitation: e.target.checked,
                              })
                            }
                            className="mr-3"
                          />
                          Require Invitation
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">Default Role</label>
                        <select
                          value={registrationPolicy.defaultRole}
                          onChange={(e) =>
                            setRegistrationPolicy({ ...registrationPolicy, defaultRole: e.target.value })
                          }
                          className="w-full border rounded px-3 py-2"
                        >
                          <option value="EMPLOYEE">Employee</option>
                          <option value="HR">HR</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={handleRegistrationPolicyUpdate}>Save Policy</Button>
                        <Button variant="outline" onClick={() => setEditingTab(null)}>
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {[
                          { key: "allowSelfRegistration", label: "Allow Self Registration" },
                          { key: "requireEmailVerification", label: "Email Verification" },
                          { key: "requireAdminApproval", label: "Admin Approval" },
                          { key: "autoActivateAccounts", label: "Auto Activate" },
                          { key: "requireInvitation", label: "Require Invitation" },
                        ].map(({ key, label }) => (
                          <span
                            key={key}
                            className={`px-3 py-2 rounded text-xs font-semibold text-center ${
                              registrationPolicy[key as keyof RegistrationPolicy]
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {label}: {registrationPolicy[key as keyof RegistrationPolicy] ? "ON" : "OFF"}
                          </span>
                        ))}
                      </div>

                      <div className="border-t pt-4">
                        <p className="text-sm text-gray-500 mb-2">Default Role</p>
                        <p className="text-lg font-semibold mb-4">{registrationPolicy.defaultRole}</p>

                        <h4 className="font-semibold mb-3">Allowed Email Domains</h4>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {registrationPolicy.allowedEmailDomains.map((domain) => (
                            <span key={domain} className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">
                              {domain}
                            </span>
                          ))}
                        </div>

                        {registrationPolicy.blockedEmailDomains.length > 0 && (
                          <>
                            <h4 className="font-semibold mb-3">Blocked Email Domains</h4>
                            <div className="flex flex-wrap gap-2">
                              {registrationPolicy.blockedEmailDomains.map((domain) => (
                                <span key={domain} className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm">
                                  {domain}
                                </span>
                              ))}
                            </div>
                          </>
                        )}
                      </div>

                      <Button onClick={() => setEditingTab("registration")}>Edit Policy</Button>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lockout Rules Tab */}
        <TabsContent value="lockout">
          <Card>
            <CardHeader>
              <CardTitle>Account Lockout Rules</CardTitle>
            </CardHeader>
            <CardContent>
              {lockoutRules && (
                <div className="space-y-4">
                  {editingTab === "lockout" ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold mb-2">Max Failed Attempts</label>
                          <Input
                            type="number"
                            value={lockoutRules.maxFailedAttempts}
                            onChange={(e) =>
                              setLockoutRules({
                                ...lockoutRules,
                                maxFailedAttempts: parseInt(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2">Lockout Duration (Minutes)</label>
                          <Input
                            type="number"
                            value={lockoutRules.lockoutDurationMinutes}
                            onChange={(e) =>
                              setLockoutRules({
                                ...lockoutRules,
                                lockoutDurationMinutes: parseInt(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2">Reset Failed Attempts After (Minutes)</label>
                          <Input
                            type="number"
                            value={lockoutRules.resetFailedAttemptsAfterMinutes}
                            onChange={(e) =>
                              setLockoutRules({
                                ...lockoutRules,
                                resetFailedAttemptsAfterMinutes: parseInt(e.target.value),
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={lockoutRules.enabled}
                            onChange={(e) => setLockoutRules({ ...lockoutRules, enabled: e.target.checked })}
                            className="mr-3"
                          />
                          Enable Lockout
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={lockoutRules.notifyAdminOnLockout}
                            onChange={(e) =>
                              setLockoutRules({ ...lockoutRules, notifyAdminOnLockout: e.target.checked })
                            }
                            className="mr-3"
                          />
                          Notify Admin on Lockout
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={lockoutRules.allowSelfUnlock}
                            onChange={(e) => setLockoutRules({ ...lockoutRules, allowSelfUnlock: e.target.checked })}
                            className="mr-3"
                          />
                          Allow Self Unlock
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={lockoutRules.progressiveDelay}
                            onChange={(e) => setLockoutRules({ ...lockoutRules, progressiveDelay: e.target.checked })}
                            className="mr-3"
                          />
                          Progressive Delay
                        </label>
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={handleLockoutRulesUpdate}>Save Rules</Button>
                        <Button variant="outline" onClick={() => setEditingTab(null)}>
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="border rounded p-4">
                          <p className="text-sm text-gray-500">Max Failed Attempts</p>
                          <p className="text-2xl font-bold">{lockoutRules.maxFailedAttempts}</p>
                        </div>
                        <div className="border rounded p-4">
                          <p className="text-sm text-gray-500">Lockout Duration</p>
                          <p className="text-2xl font-bold">{lockoutRules.lockoutDurationMinutes} min</p>
                        </div>
                        <div className="border rounded p-4">
                          <p className="text-sm text-gray-500">Reset After</p>
                          <p className="text-2xl font-bold">{lockoutRules.resetFailedAttemptsAfterMinutes} min</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-6">
                        {[
                          { key: "enabled", label: "Lockout Enabled" },
                          { key: "notifyAdminOnLockout", label: "Notify Admin" },
                          { key: "allowSelfUnlock", label: "Allow Self Unlock" },
                          { key: "progressiveDelay", label: "Progressive Delay" },
                        ].map(({ key, label }) => (
                          <span
                            key={key}
                            className={`block px-3 py-2 rounded text-sm font-semibold ${
                              lockoutRules[key as keyof LockoutRules]
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {label}: {lockoutRules[key as keyof LockoutRules] ? "ON" : "OFF"}
                          </span>
                        ))}
                      </div>

                      <Button onClick={() => setEditingTab("lockout")}>Edit Rules</Button>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Employees Tab */}
        <TabsContent value="employees">
          <Card>
            <CardHeader>
              <CardTitle>Employee Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add Employee Form */}
              {showAddEmployee && (
                <div className="border rounded p-4 bg-gray-50">
                  <h3 className="font-semibold mb-4">Add New Employee</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Email *</label>
                      <Input
                        type="email"
                        value={newEmployee.email}
                        onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                        placeholder="employee@company.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Name *</label>
                      <Input
                        value={newEmployee.name}
                        onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Department</label>
                      <Input
                        value={newEmployee.department}
                        onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                        placeholder="HR"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Section</label>
                      <Input
                        value={newEmployee.section}
                        onChange={(e) => setNewEmployee({ ...newEmployee, section: e.target.value })}
                        placeholder="Recruitment"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Role</label>
                      <select
                        value={newEmployee.role}
                      onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value as CreateEmployeeRequest["role"] })}
                        className="w-full border rounded px-3 py-2"
                      >
                        <option value="EMPLOYEE">Employee</option>
                        <option value="HR">HR</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Temporary Password *</label>
                      <Input
                        type="password"
                        value={newEmployee.password}
                        onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                        placeholder="Temp password"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleCreateEmployee}>Create Employee</Button>
                    <Button variant="outline" onClick={() => setShowAddEmployee(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {!showAddEmployee && <Button onClick={() => setShowAddEmployee(true)}>+ Add New Employee</Button>}

              {/* Employees List */}
              <div>
                <h3 className="font-semibold mb-4">Current Employees ({employees.length})</h3>
                {employees.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left">Name</th>
                          <th className="px-4 py-2 text-left">Email</th>
                          <th className="px-4 py-2 text-left">Role</th>
                          <th className="px-4 py-2 text-left">Department</th>
                          <th className="px-4 py-2 text-left">Status</th>
                          <th className="px-4 py-2 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees.map((employee) => (
                          <tr key={employee.id} className="border-b">
                            <td className="px-4 py-2">{employee.name}</td>
                            <td className="px-4 py-2">{employee.email}</td>
                            <td className="px-4 py-2">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                                {employee.role}
                              </span>
                            </td>
                            <td className="px-4 py-2">{employee.department || "N/A"}</td>
                            <td className="px-4 py-2">
                              <span
                                className={`px-2 py-1 rounded text-xs font-semibold ${
                                  employee.isActive
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {employee.isActive ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-center">
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteEmployee(employee.id)}
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500">No employees added yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
