/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback } from "react";
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

  /* ================= FETCH ================= */

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [statusRes, settingsRes] = await Promise.all([
        getScheduleStatus(),
        getScheduleSettings(),
      ]);

      if (statusRes.success) setStatus(statusRes.data.status);
      if (settingsRes.success) setSettings(settingsRes.data.settings);
    } catch (err) {
      setError("Failed to load schedule settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  /* ================= GLOBAL ACTIONS ================= */

  const runAction = async (
    action: "start" | "stop" | "reload",
    fn: () => Promise<any>,
    successText: string
  ) => {
    try {
      setActionLoading(action);
      const res = await fn();
      if (!res.success) throw new Error(res.message);
      await fetchAll();
      setSuccessMessage(successText);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (e: any) {
      setError(e.message || "Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  /* ================= TOGGLE (FIXED) ================= */

  const handleToggle = async (
    scheduleType: keyof ScheduleSettings,
    enabled: boolean
  ) => {
    if (!settings) return;

    const previous = settings[scheduleType];

    // ✅ Optimistic UI update
    setSettings(prev =>
      prev
        ? {
            ...prev,
            [scheduleType]: {
              ...prev[scheduleType],
              enabled,
            },
          }
        : prev
    );

    try {
      setActionLoading(scheduleType);
      const res = await toggleSchedule(scheduleType, enabled);
      if (!res.success) throw new Error(res.message);
      setSuccessMessage(
        `${scheduleType.replace(/([A-Z])/g, " $1")} ${
          enabled ? "enabled" : "disabled"
        }`
      );
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      // ❌ Rollback on failure
      setSettings(prev =>
        prev
          ? {
              ...prev,
              [scheduleType]: previous,
            }
          : prev
      );
      setError(err.message || "Toggle failed");
    } finally {
      setActionLoading(null);
    }
  };

  /* ================= SAVE ================= */

  const handleSaveSettings = async () => {
    if (!settings) return;
    try {
      setSaving(true);
      const res = await updateScheduleSettings(settings);
      if (!res.success) throw new Error(res.message);
      setSuccessMessage("Schedule settings saved");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  /* ================= UI ================= */

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
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="h-6 w-6" /> Schedule Settings
        </h2>
        <Badge className={status?.isRunning ? "bg-green-500" : ""}>
          {status?.isRunning ? "Scheduler Running" : "Scheduler Stopped"}
        </Badge>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* CONTROLS */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduler Controls</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button
            disabled={actionLoading !== null || status?.isRunning}
            onClick={() => runAction("start", startSchedules, "Scheduler started")}
          >
            <Play className="h-4 w-4 mr-2" /> Start
          </Button>
          <Button
            variant="destructive"
            disabled={actionLoading !== null || !status?.isRunning}
            onClick={() => runAction("stop", stopSchedules, "Scheduler stopped")}
          >
            <Square className="h-4 w-4 mr-2" /> Stop
          </Button>
          <Button
            variant="outline"
            disabled={actionLoading !== null}
            onClick={() => runAction("reload", reloadSchedules, "Scheduler reloaded")}
          >
            <RefreshCw className="h-4 w-4 mr-2" /> Reload
          </Button>
        </CardContent>
      </Card>

      {/* SAVE */}
      <Card>
        <CardContent className="pt-6">
          <Button
            size="lg"
            className="w-full"
            disabled={saving}
            onClick={handleSaveSettings}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save All Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
