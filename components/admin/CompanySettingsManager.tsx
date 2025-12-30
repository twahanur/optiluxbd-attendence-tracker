"use client";

import { useEffect, useState } from "react";
import {
  getCompanyProfile,
  updateCompanyProfile,
  getWorkingHours,
  updateWorkingHours,
  getHolidays,
  addHoliday,
  deleteHoliday,
  type CompanyProfile,
  type WorkingHours,
  type Holiday,
} from "@/service/admin/company-settings";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CompanySettingsManager() {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [workingHours, setWorkingHours] = useState<WorkingHours | null>(null);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<CompanyProfile>>({});
  const [newHoliday, setNewHoliday] = useState<Omit<Holiday, "id">>({ name: "", date: "", type: "public", description: "" });

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [profileRes, hoursRes, holidaysRes] = await Promise.all([
          getCompanyProfile(),
          getWorkingHours(),
          getHolidays(),
        ]);

        if (profileRes.success && profileRes.data) {
          setProfile(profileRes.data.profile);
          setFormData(profileRes.data.profile);
        } else {
          setError(profileRes.message || "Failed to fetch company profile");
        }

        if (hoursRes.success && hoursRes.data) {
          setWorkingHours(hoursRes.data.workingHours);
        }

        if (holidaysRes.success && holidaysRes.data) {
          setHolidays(holidaysRes.data.holidays);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred while fetching company settings");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle profile update
  const handleProfileUpdate = async () => {
    try {
      setError(null);
      const response = await updateCompanyProfile(formData as CompanyProfile);

      if (response.success) {
        setProfile(formData as CompanyProfile);
        setEditMode(false);
        setSuccessMessage("Company profile updated successfully");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.message || "Failed to update company profile");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while updating profile");
    }
  };

  // Handle working hours update
  const handleWorkingHoursUpdate = async () => {
    try {
      setError(null);
      if (!workingHours) return;

      const response = await updateWorkingHours(workingHours);

      if (response.success) {
        setSuccessMessage("Working hours updated successfully");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.message || "Failed to update working hours");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while updating working hours");
    }
  };

  // Handle add holiday
  const handleAddHoliday = async () => {
    try {
      setError(null);

      if (!newHoliday.name || !newHoliday.date) {
        setError("Please fill in all required fields");
        return;
      }

      const response = await addHoliday({
        name: newHoliday.name,
        date: newHoliday.date,
        type: newHoliday.type,
        description: newHoliday.description,
      });

      if (response.success) {
        setHolidays([...holidays, response.data]);
        setNewHoliday({ name: "", date: "", type: "public", description: "" });
        setSuccessMessage("Holiday added successfully");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.message || "Failed to add holiday");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while adding holiday");
    }
  };

  // Handle delete holiday
  const handleDeleteHoliday = async (id: number) => {
    try {
      setError(null);
      const response = await deleteHoliday(id);

      if (response.success) {
        setHolidays(holidays.filter(h => h.id !== id));
        setSuccessMessage("Holiday deleted successfully");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.message || "Failed to delete holiday");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while deleting holiday");
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <p className="text-lg text-gray-500">Loading company settings...</p>
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

      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Company Profile</TabsTrigger>
          <TabsTrigger value="working-hours">Working Hours</TabsTrigger>
          <TabsTrigger value="holidays">Holidays</TabsTrigger>
        </TabsList>

        {/* Company Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Company Profile</CardTitle>
            </CardHeader>
            <CardContent>
              {editMode ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Name</label>
                      <Input
                        value={formData.name || ""}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Email</label>
                      <Input
                        value={formData.email || ""}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Phone</label>
                      <Input
                        value={formData.phone || ""}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Website</label>
                      <Input
                        value={formData.website || ""}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold mb-2">Address</label>
                      <Input
                        value={formData.address || ""}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Industry</label>
                      <Input
                        value={formData.industry || ""}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Logo URL</label>
                      <Input
                        value={formData.logo || ""}
                        onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleProfileUpdate}>Save Changes</Button>
                    <Button variant="outline" onClick={() => setEditMode(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {profile && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Name</p>
                          <p className="text-lg font-semibold">{profile.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="text-lg font-semibold">{profile.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="text-lg font-semibold">{profile.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Website</p>
                          <p className="text-lg font-semibold">{profile.website || "N/A"}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="text-lg font-semibold">{profile.address}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Industry</p>
                          <p className="text-lg font-semibold">{profile.industry || "N/A"}</p>
                        </div>
                      </div>
                      <Button onClick={() => setEditMode(true)}>Edit Profile</Button>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Working Hours Tab */}
        <TabsContent value="working-hours">
          <Card>
            <CardHeader>
              <CardTitle>Working Hours Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              {workingHours && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Timezone</label>
                      <p className="text-lg">{workingHours.timezone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Lunch Break Start</label>
                      <p className="text-lg">{workingHours.lunchBreakStart}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Lunch Break End</label>
                      <p className="text-lg">{workingHours.lunchBreakEnd}</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left">Day</th>
                          <th className="px-4 py-2 text-left">Start Time</th>
                          <th className="px-4 py-2 text-left">End Time</th>
                          <th className="px-4 py-2 text-left">Working Day</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(workingHours).map(
                          ([day, hours]) =>
                            typeof hours === "object" && "start" in hours && (
                              <tr key={day} className="border-b">
                                <td className="px-4 py-2 font-semibold capitalize">{day}</td>
                                <td className="px-4 py-2">{hours.start}</td>
                                <td className="px-4 py-2">{hours.end}</td>
                                <td className="px-4 py-2">
                                  <span
                                    className={`px-2 py-1 rounded text-xs font-semibold ${
                                      hours.isWorkingDay
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {hours.isWorkingDay ? "Yes" : "No"}
                                  </span>
                                </td>
                              </tr>
                            )
                        )}
                      </tbody>
                    </table>
                  </div>
                  <Button onClick={handleWorkingHoursUpdate}>Update Working Hours</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Holidays Tab */}
        <TabsContent value="holidays">
          <Card>
            <CardHeader>
              <CardTitle>Holiday Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add Holiday Form */}
              <div className="border-b pb-6">
                <h3 className="font-semibold mb-4">Add New Holiday</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Holiday Name</label>
                    <Input
                      placeholder="e.g., New Year"
                      value={newHoliday.name}
                      onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Date</label>
                    <Input
                      type="date"
                      value={newHoliday.date}
                      onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Type</label>
                    <select
                      value={newHoliday.type}
                      onChange={(e) => setNewHoliday({ ...newHoliday, type: e.target.value as Holiday["type"] })}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Description</label>
                    <Input
                      placeholder="Optional description"
                      value={newHoliday.description}
                      onChange={(e) => setNewHoliday({ ...newHoliday, description: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={handleAddHoliday}>Add Holiday</Button>
              </div>

              {/* Holidays List */}
              <div>
                <h3 className="font-semibold mb-4">Existing Holidays</h3>
                {holidays.length > 0 ? (
                  <div className="space-y-3">
                    {holidays.map((holiday) => (
                      <div key={holiday.id} className="flex items-center justify-between border rounded p-4">
                        <div className="flex-1">
                          <p className="font-semibold">{holiday.name}</p>
                          <div className="flex gap-4 text-sm text-gray-600 mt-2">
                            <span>📅 {holiday.date}</span>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              holiday.type === "public"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-purple-100 text-purple-800"
                            }`}>
                              {holiday.type.charAt(0).toUpperCase() + holiday.type.slice(1)}
                            </span>
                            {holiday.description && <span>{holiday.description}</span>}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => holiday.id && handleDeleteHoliday(holiday.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No holidays added yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
