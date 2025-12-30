"use client";

import { useEffect, useState } from "react";
import { getAllSettings, updateSetting } from "@/service/admin/settings";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Setting {
  id: number;
  key: string;
  value: string;
  category: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export default function SettingsManager() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch all settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllSettings();
        if (response.success && response.data) {
          setSettings(response.data.data.settings);
        } else {
          setError(response.message || "Failed to fetch settings");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred while fetching settings");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Handle edit click
  const handleEdit = (setting: Setting) => {
    setEditingId(setting.id);
    setEditValues({ [setting.key]: setting.value });
  };

  // Handle save
  const handleSave = async (key: string) => {
    try {
      setError(null);
      const newValue = editValues[key];
      const response = await updateSetting(key, newValue);
      
      if (response.success) {
        setSettings(settings.map(s => s.key === key ? { ...s, value: newValue } : s));
        setEditingId(null);
        setSuccessMessage("Setting updated successfully");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.message || "Failed to update setting");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while updating setting");
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setEditingId(null);
    setEditValues({});
  };

  // Group settings by category
  const groupedSettings = settings.reduce((acc, setting) => {
    if (!acc[setting.category]) {
      acc[setting.category] = [];
    }
    acc[setting.category].push(setting);
    return acc;
  }, {} as Record<string, Setting[]>);

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <p className="text-lg text-gray-500">Loading settings...</p>
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

      {Object.entries(groupedSettings).map(([category, categorySettings]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="capitalize">{category} Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categorySettings.map((setting) => (
                <div key={setting.id} className="flex items-center justify-between border-b pb-4 last:border-b-0">
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{setting.key}</p>
                    {setting.description && (
                      <p className="text-xs text-gray-500">{setting.description}</p>
                    )}
                  </div>

                  {editingId === setting.id ? (
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={editValues[setting.key] || ""}
                        onChange={(e) =>
                          setEditValues({ ...editValues, [setting.key]: e.target.value })
                        }
                        className="w-48"
                      />
                      <Button size="sm" onClick={() => handleSave(setting.key)}>
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2 items-center">
                      <p className="text-sm text-gray-700 min-w-48 text-right">{setting.value}</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(setting)}
                      >
                        Edit
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
