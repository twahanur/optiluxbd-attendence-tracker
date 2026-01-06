"use client";

import { useEffect, useState } from "react";
import {
  getScheduleStatus,
  getScheduleSettings,
  updateScheduleSettings,
  startSchedules,
  stopSchedules,
  reloadSchedules,
  toggleSchedule,
  type ScheduleStatus,
  type ScheduleSettings,
} from "@/service/admin/schedule-settings";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Calendar,
  Play,
  Square,
  RefreshCw,
  Save,
  Clock,
  Mail,
  FileText,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function ScheduleSettingsManager() {
  const [status, setStatus] = useState<ScheduleStatus | null>(null);
  const [settings, setSettings] = useState<ScheduleSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch schedule data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [statusRes, settingsRes] = await Promise.all([
          getScheduleStatus(),
          getScheduleSettings(),
        ]);

        if (statusRes.success && statusRes.data) {
          setStatus(statusRes.data.status);
        }

        if (settingsRes.success && settingsRes.data) {
          setSettings(settingsRes.data.settings);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load schedule settings");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle start all schedules
  const handleStart = async () => {
    try {
      setActionLoading("start");
      const response = await startSchedules();
      if (response.success) {
        setSuccessMessage("All schedules started successfully");
        // Refresh status
        const statusRes = await getScheduleStatus();
        if (statusRes.success && statusRes.data) {
          setStatus(statusRes.data.status);
        }
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.message || "Failed to start schedules");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start schedules");
    } finally {
      setActionLoading(null);
    }
  };

  // Handle stop all schedules
  const handleStop = async () => {
    try {
      setActionLoading("stop");
      const response = await stopSchedules();
      if (response.success) {
        setSuccessMessage("All schedules stopped successfully");
        // Refresh status
        const statusRes = await getScheduleStatus();
        if (statusRes.success && statusRes.data) {
          setStatus(statusRes.data.status);
        }
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.message || "Failed to stop schedules");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to stop schedules");
    } finally {
      setActionLoading(null);
    }
  };

  // Handle reload schedules
  const handleReload = async () => {
    try {
      setActionLoading("reload");
      const response = await reloadSchedules();
      if (response.success) {
        setSuccessMessage("Schedules reloaded with current settings");
        // Refresh status
        const statusRes = await getScheduleStatus();
        if (statusRes.success && statusRes.data) {
          setStatus(statusRes.data.status);
        }
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.message || "Failed to reload schedules");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reload schedules");
    } finally {
      setActionLoading(null);
    }
  };

  // Handle toggle individual schedule
  const handleToggle = async (scheduleType: string, enabled: boolean) => {
    try {
      setActionLoading(scheduleType);
      const response = await toggleSchedule(scheduleType, enabled);
      if (response.success) {
        setSuccessMessage(`${scheduleType} schedule ${enabled ? "enabled" : "disabled"}`);
        // Update local state
        if (settings) {
          const updatedSettings = { ...settings };
          if (scheduleType in updatedSettings) {
            (updatedSettings[scheduleType as keyof ScheduleSettings] as { enabled: boolean }).enabled = enabled;
          }
          setSettings(updatedSettings);
        }
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.message || `Failed to toggle ${scheduleType}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to toggle ${scheduleType}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Handle save settings
  const handleSaveSettings = async () => {
    if (!settings) return;
    try {
      setSaving(true);
      setError(null);
      const response = await updateScheduleSettings(settings);
      if (response.success) {
        setSuccessMessage("Schedule settings saved successfully");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.message || "Failed to save schedule settings");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save schedule settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading schedule settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Schedule Settings
          </h2>
          <p className="text-muted-foreground">
            Manage automated email notifications and reports
          </p>
        </div>
        <div className="flex items-center gap-2">
          {status?.isRunning ? (
            <Badge className="bg-green-500">Scheduler Running</Badge>
          ) : (
            <Badge variant="secondary">Scheduler Stopped</Badge>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Scheduler Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduler Controls</CardTitle>
          <CardDescription>Start, stop, or reload the scheduler service</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button
              onClick={handleStart}
              disabled={actionLoading !== null || status?.isRunning}
              className="bg-green-600 hover:bg-green-700"
            >
              {actionLoading === "start" ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              Start All
            </Button>
            <Button
              onClick={handleStop}
              disabled={actionLoading !== null || !status?.isRunning}
              variant="destructive"
            >
              {actionLoading === "stop" ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Square className="h-4 w-4 mr-2" />
              )}
              Stop All
            </Button>
            <Button
              onClick={handleReload}
              disabled={actionLoading !== null}
              variant="outline"
            >
              {actionLoading === "reload" ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Reload
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Items */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Daily Reminder */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-500" />
                <CardTitle className="text-lg">Daily Reminder</CardTitle>
              </div>
              <Switch
                checked={settings?.dailyReminder?.enabled || false}
                onCheckedChange={(checked) => handleToggle("dailyReminder", checked)}
                disabled={actionLoading === "dailyReminder"}
              />
            </div>
            <CardDescription>
              Reminds employees to mark their attendance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dailyCron">Cron Expression</Label>
              <Input
                id="dailyCron"
                value={settings?.dailyReminder?.cronExpression || ""}
                onChange={(e) =>
                  setSettings(settings ? {
                    ...settings,
                    dailyReminder: {
                      ...settings.dailyReminder,
                      cronExpression: e.target.value,
                    },
                  } : null)
                }
                placeholder="0 13 * * 1-5"
              />
              <p className="text-xs text-muted-foreground">
                Default: 1:00 PM on weekdays
              </p>
            </div>
            {status?.schedules?.dailyReminder && (
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  Next run: {status.schedules.dailyReminder.nextRun || "N/A"}
                </p>
                <p>Success: {status.schedules.dailyReminder.successCount} | Failures: {status.schedules.dailyReminder.failureCount}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weekly Report */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-500" />
                <CardTitle className="text-lg">Weekly Report</CardTitle>
              </div>
              <Switch
                checked={settings?.weeklyReport?.enabled || false}
                onCheckedChange={(checked) => handleToggle("weeklyReport", checked)}
                disabled={actionLoading === "weeklyReport"}
              />
            </div>
            <CardDescription>
              Sends weekly attendance summary to admins
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="weeklyCron">Cron Expression</Label>
              <Input
                id="weeklyCron"
                value={settings?.weeklyReport?.cronExpression || ""}
                onChange={(e) =>
                  setSettings(settings ? {
                    ...settings,
                    weeklyReport: {
                      ...settings.weeklyReport,
                      cronExpression: e.target.value,
                    },
                  } : null)
                }
                placeholder="0 9 * * 1"
              />
              <p className="text-xs text-muted-foreground">
                Default: 9:00 AM on Monday
              </p>
            </div>
            {status?.schedules?.weeklyReport && (
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  Next run: {status.schedules.weeklyReport.nextRun || "N/A"}
                </p>
                <p>Success: {status.schedules.weeklyReport.successCount} | Failures: {status.schedules.weeklyReport.failureCount}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* End of Day */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                <CardTitle className="text-lg">End of Day Summary</CardTitle>
              </div>
              <Switch
                checked={settings?.endOfDay?.enabled || false}
                onCheckedChange={(checked) => handleToggle("endOfDay", checked)}
                disabled={actionLoading === "endOfDay"}
              />
            </div>
            <CardDescription>
              Daily attendance summary notification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="endOfDayCron">Cron Expression</Label>
              <Input
                id="endOfDayCron"
                value={settings?.endOfDay?.cronExpression || ""}
                onChange={(e) =>
                  setSettings(settings ? {
                    ...settings,
                    endOfDay: {
                      ...settings.endOfDay,
                      cronExpression: e.target.value,
                    },
                  } : null)
                }
                placeholder="0 18 * * 1-5"
              />
              <p className="text-xs text-muted-foreground">
                Default: 6:00 PM on weekdays
              </p>
            </div>
            {status?.schedules?.endOfDay && (
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  Next run: {status.schedules.endOfDay.nextRun || "N/A"}
                </p>
                <p>Success: {status.schedules.endOfDay.successCount} | Failures: {status.schedules.endOfDay.failureCount}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Report */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-500" />
                <CardTitle className="text-lg">Monthly Report</CardTitle>
              </div>
              <Switch
                checked={settings?.monthlyReport?.enabled || false}
                onCheckedChange={(checked) => handleToggle("monthlyReport", checked)}
                disabled={actionLoading === "monthlyReport"}
              />
            </div>
            <CardDescription>
              Monthly attendance statistics report
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="monthlyCron">Cron Expression</Label>
              <Input
                id="monthlyCron"
                value={settings?.monthlyReport?.cronExpression || ""}
                onChange={(e) =>
                  setSettings(settings ? {
                    ...settings,
                    monthlyReport: {
                      ...settings.monthlyReport,
                      cronExpression: e.target.value,
                    },
                  } : null)
                }
                placeholder="0 9 1 * *"
              />
              <p className="text-xs text-muted-foreground">
                Default: 9:00 AM on 1st of month
              </p>
            </div>
            {status?.schedules?.monthlyReport && (
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  Next run: {status.schedules.monthlyReport.nextRun || "N/A"}
                </p>
                <p>Success: {status.schedules.monthlyReport.successCount} | Failures: {status.schedules.monthlyReport.failureCount}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Timezone Setting */}
      <Card>
        <CardHeader>
          <CardTitle>Timezone Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                value={settings?.timezone || "Asia/Dhaka"}
                onChange={(e) =>
                  setSettings(settings ? { ...settings, timezone: e.target.value } : null)
                }
                placeholder="Asia/Dhaka"
              />
            </div>
            <Button onClick={handleSaveSettings} disabled={saving} className="mt-6">
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
