"use client";

import { useEffect, useState } from "react";
import {
  getPasswordRules,
  updatePasswordRules,
  getUsernameRules,
  updateUsernameRules,
  getRateLimitConfig,
  updateRateLimitConfig,
  type PasswordRules,
  type UsernameRules,
  type RateLimitConfig,
} from "@/service/admin/security-settings";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Shield, Key, User, Gauge, Save, RotateCcw, AlertCircle, CheckCircle } from "lucide-react";

export default function SecuritySettingsManager() {
  const [passwordRules, setPasswordRules] = useState<PasswordRules | null>(null);
  const [usernameRules, setUsernameRules] = useState<UsernameRules | null>(null);
  const [rateLimitConfig, setRateLimitConfig] = useState<RateLimitConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("password");

  // Fetch all security settings
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [passwordRes, usernameRes, rateLimitRes] = await Promise.all([
          getPasswordRules(),
          getUsernameRules(),
          getRateLimitConfig(),
        ]);

        if (passwordRes.success && passwordRes.data) {
          setPasswordRules(passwordRes.data as unknown as PasswordRules);
        }

        if (usernameRes.success && usernameRes.data) {
          setUsernameRules(usernameRes.data as unknown as UsernameRules);
        }

        if (rateLimitRes.success && rateLimitRes.data) {
          setRateLimitConfig(rateLimitRes.data as unknown as RateLimitConfig);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load security settings");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle password rules update
  const handlePasswordRulesUpdate = async () => {
    if (!passwordRules) return;
    try {
      setSaving(true);
      setError(null);
      const response = await updatePasswordRules(passwordRules);
      if (response.success) {
        setSuccessMessage("Password rules updated successfully");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.message || "Failed to update password rules");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update password rules");
    } finally {
      setSaving(false);
    }
  };

  // Handle username rules update
  const handleUsernameRulesUpdate = async () => {
    if (!usernameRules) return;
    try {
      setSaving(true);
      setError(null);
      const response = await updateUsernameRules(usernameRules);
      if (response.success) {
        setSuccessMessage("Username rules updated successfully");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.message || "Failed to update username rules");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update username rules");
    } finally {
      setSaving(false);
    }
  };

  // Handle rate limit update
  const handleRateLimitUpdate = async () => {
    if (!rateLimitConfig) return;
    try {
      setSaving(true);
      setError(null);
      const response = await updateRateLimitConfig(rateLimitConfig);
      if (response.success) {
        setSuccessMessage("Rate limit configuration updated successfully");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.message || "Failed to update rate limit configuration");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update rate limit configuration");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading security settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Security Settings
          </h2>
          <p className="text-muted-foreground">
            Configure password rules, username validation, and rate limiting
          </p>
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

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="password" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Password Rules
          </TabsTrigger>
          <TabsTrigger value="username" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Username Rules
          </TabsTrigger>
          <TabsTrigger value="ratelimit" className="flex items-center gap-2">
            <Gauge className="h-4 w-4" />
            Rate Limiting
          </TabsTrigger>
        </TabsList>

        {/* Password Rules Tab */}
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Password Validation Rules</CardTitle>
              <CardDescription>
                Configure password complexity requirements for all users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {passwordRules && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="minLength">Minimum Length</Label>
                      <Input
                        id="minLength"
                        type="number"
                        min={4}
                        max={50}
                        value={passwordRules.minLength}
                        onChange={(e) =>
                          setPasswordRules({
                            ...passwordRules,
                            minLength: parseInt(e.target.value) || 8,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialChars">Special Characters</Label>
                      <Input
                        id="specialChars"
                        value={passwordRules.specialCharacters || "!@#$%^&*()_+-=[]{}|;:,.<>?"}
                        onChange={(e) =>
                          setPasswordRules({
                            ...passwordRules,
                            specialCharacters: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <Label htmlFor="requireUppercase">Require Uppercase</Label>
                      <Switch
                        id="requireUppercase"
                        checked={passwordRules.requireUppercase}
                        onCheckedChange={(checked) =>
                          setPasswordRules({ ...passwordRules, requireUppercase: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <Label htmlFor="requireLowercase">Require Lowercase</Label>
                      <Switch
                        id="requireLowercase"
                        checked={passwordRules.requireLowercase}
                        onCheckedChange={(checked) =>
                          setPasswordRules({ ...passwordRules, requireLowercase: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <Label htmlFor="requireNumber">Require Number</Label>
                      <Switch
                        id="requireNumber"
                        checked={passwordRules.requireNumber}
                        onCheckedChange={(checked) =>
                          setPasswordRules({ ...passwordRules, requireNumber: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <Label htmlFor="requireSpecial">Require Special Character</Label>
                      <Switch
                        id="requireSpecial"
                        checked={passwordRules.requireSpecial}
                        onCheckedChange={(checked) =>
                          setPasswordRules({ ...passwordRules, requireSpecial: checked })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => window.location.reload()}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                    <Button onClick={handlePasswordRulesUpdate} disabled={saving}>
                      {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                      Save Changes
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Username Rules Tab */}
        <TabsContent value="username">
          <Card>
            <CardHeader>
              <CardTitle>Username Validation Rules</CardTitle>
              <CardDescription>
                Configure username format and validation requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {usernameRules && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="usernameMinLength">Minimum Length</Label>
                      <Input
                        id="usernameMinLength"
                        type="number"
                        min={1}
                        max={20}
                        value={usernameRules.minLength}
                        onChange={(e) =>
                          setUsernameRules({
                            ...usernameRules,
                            minLength: parseInt(e.target.value) || 3,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="usernameMaxLength">Maximum Length</Label>
                      <Input
                        id="usernameMaxLength"
                        type="number"
                        min={5}
                        max={100}
                        value={usernameRules.maxLength}
                        onChange={(e) =>
                          setUsernameRules({
                            ...usernameRules,
                            maxLength: parseInt(e.target.value) || 50,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <Label htmlFor="allowSpecial">Allow Special Characters</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow special characters like @, #, $, etc. in usernames
                      </p>
                    </div>
                    <Switch
                      id="allowSpecial"
                      checked={usernameRules.allowSpecial}
                      onCheckedChange={(checked) =>
                        setUsernameRules({ ...usernameRules, allowSpecial: checked })
                      }
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => window.location.reload()}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                    <Button onClick={handleUsernameRulesUpdate} disabled={saving}>
                      {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                      Save Changes
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rate Limiting Tab */}
        <TabsContent value="ratelimit">
          <Card>
            <CardHeader>
              <CardTitle>Rate Limiting Configuration</CardTitle>
              <CardDescription>
                Configure API rate limiting to prevent abuse
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {rateLimitConfig && (
                <>
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                    <div>
                      <Label htmlFor="rateLimitEnabled" className="text-base font-medium">
                        Enable Rate Limiting
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Limit the number of API requests per time window
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={rateLimitConfig.enabled ? "default" : "secondary"}>
                        {rateLimitConfig.enabled ? "Enabled" : "Disabled"}
                      </Badge>
                      <Switch
                        id="rateLimitEnabled"
                        checked={rateLimitConfig.enabled}
                        onCheckedChange={(checked) =>
                          setRateLimitConfig({ ...rateLimitConfig, enabled: checked })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="maxRequests">Max Requests</Label>
                      <Input
                        id="maxRequests"
                        type="number"
                        min={1}
                        max={10000}
                        value={rateLimitConfig.maxRequests}
                        onChange={(e) =>
                          setRateLimitConfig({
                            ...rateLimitConfig,
                            maxRequests: parseInt(e.target.value) || 100,
                          })
                        }
                        disabled={!rateLimitConfig.enabled}
                      />
                      <p className="text-xs text-muted-foreground">
                        Maximum number of requests per time window
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="windowMs">Time Window (ms)</Label>
                      <Input
                        id="windowMs"
                        type="number"
                        min={1000}
                        max={3600000}
                        value={rateLimitConfig.windowMs}
                        onChange={(e) =>
                          setRateLimitConfig({
                            ...rateLimitConfig,
                            windowMs: parseInt(e.target.value) || 60000,
                          })
                        }
                        disabled={!rateLimitConfig.enabled}
                      />
                      <p className="text-xs text-muted-foreground">
                        Time window in milliseconds (60000 = 1 minute)
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Current Setting:</strong> {rateLimitConfig.maxRequests} requests per{" "}
                      {(rateLimitConfig.windowMs / 1000 / 60).toFixed(1)} minute(s)
                    </p>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => window.location.reload()}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                    <Button onClick={handleRateLimitUpdate} disabled={saving}>
                      {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                      Save Changes
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
