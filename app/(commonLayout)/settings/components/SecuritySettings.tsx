'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Loader2, RefreshCw, ShieldCheck, UserCheck, Gauge } from 'lucide-react';
import { toast } from 'sonner';

import {
  securitySettingsApi,
  PasswordRules,
  UsernameRules,
  RateLimitUpdateRequest,
} from '@/service/admin';

type RateLimitFormState = {
  enabled: boolean;
  maxRequests: number;
  windowMinutes: number;
};

const defaultPasswordRules: PasswordRules = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecial: true,
  specialCharacters: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

const defaultUsernameRules: UsernameRules = {
  minLength: 3,
  maxLength: 30,
  allowSpecial: false,
};

const defaultRateLimit: RateLimitFormState = {
  enabled: true,
  maxRequests: 10000,
  windowMinutes: 15,
};

export default function SecuritySettings() {
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState<null | 'password' | 'username' | 'rate'>(null);
  const [passwordRules, setPasswordRules] = useState<PasswordRules>(defaultPasswordRules);
  const [usernameRules, setUsernameRules] = useState<UsernameRules>(defaultUsernameRules);
  const [rateLimit, setRateLimit] = useState<RateLimitFormState>(defaultRateLimit);

  useEffect(() => {
    loadSecuritySettings();
  }, []);

  const loadSecuritySettings = async () => {
    try {
      setLoading(true);
      const response = await securitySettingsApi.getAll();

      if (response.success && response.data) {
        const { passwordRules, usernameRules, rateLimiting } = response.data;

        setPasswordRules({ ...defaultPasswordRules, ...passwordRules });
        setUsernameRules({ ...defaultUsernameRules, ...usernameRules });

        if (rateLimiting) {
          setRateLimit({
            enabled: rateLimiting.enabled,
            maxRequests: rateLimiting.maxRequests,
            windowMinutes: Math.max(1, Math.round(rateLimiting.windowMs / 60000)),
          });
        }
      } else {
        toast.error(response.message || 'Failed to load security settings');
      }
    } catch (error) {
      toast.error('Failed to load security settings');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePasswordRules = async () => {
    if (passwordRules.minLength < 6 || passwordRules.minLength > 32) {
      toast.error('Password length must be between 6 and 32 characters');
      return;
    }

    try {
      setSavingSection('password');
      const response = await securitySettingsApi.updatePasswordRules(passwordRules);
      if (response.success) {
        toast.success('Password rules updated');
        await loadSecuritySettings();
      } else {
        toast.error(response.message || 'Failed to update password rules');
      }
    } catch (error) {
      toast.error('Failed to update password rules');
      console.error(error);
    } finally {
      setSavingSection(null);
    }
  };

  const handleSaveUsernameRules = async () => {
    if (usernameRules.minLength < 3) {
      toast.error('Minimum username length must be at least 3 characters');
      return;
    }

    if (usernameRules.maxLength > 50) {
      toast.error('Maximum username length cannot exceed 50 characters');
      return;
    }

    if (usernameRules.minLength > usernameRules.maxLength) {
      toast.error('Minimum length cannot be greater than maximum length');
      return;
    }

    try {
      setSavingSection('username');
      const response = await securitySettingsApi.updateUsernameRules(usernameRules);
      if (response.success) {
        toast.success('Username rules updated');
        await loadSecuritySettings();
      } else {
        toast.error(response.message || 'Failed to update username rules');
      }
    } catch (error) {
      toast.error('Failed to update username rules');
      console.error(error);
    } finally {
      setSavingSection(null);
    }
  };

  const handleSaveRateLimit = async () => {
    if (rateLimit.maxRequests < 10 || rateLimit.maxRequests > 100000) {
      toast.error('Max requests must be between 10 and 100000');
      return;
    }

    if (rateLimit.windowMinutes < 1 || rateLimit.windowMinutes > 1440) {
      toast.error('Window must be between 1 and 1440 minutes');
      return;
    }

    const payload: RateLimitUpdateRequest = {
      enabled: rateLimit.enabled,
      maxRequests: rateLimit.maxRequests,
      windowMinutes: rateLimit.windowMinutes,
    };

    try {
      setSavingSection('rate');
      const response = await securitySettingsApi.updateRateLimit(payload);
      if (response.success) {
        toast.success('Rate limit configuration updated');
        await loadSecuritySettings();
      } else {
        toast.error(response.message || 'Failed to update rate limit');
      }
    } catch (error) {
      toast.error('Failed to update rate limit');
      console.error(error);
    } finally {
      setSavingSection(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading security settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Security Controls</h3>
          <p className="text-sm text-muted-foreground">
            Manage dynamic password, username, and API rate limit rules
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-300 border-emerald-400/30">
            Cached 1 minute
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={loadSecuritySettings}
            disabled={loading || savingSection !== null}
            className="flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            <div>
              <CardTitle>Password Rules</CardTitle>
              <CardDescription>Control password complexity and special characters</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="passwordMin">Minimum Length</Label>
              <Input
                id="passwordMin"
                type="number"
                value={passwordRules.minLength}
                onChange={(e) =>
                  setPasswordRules({ ...passwordRules, minLength: parseInt(e.target.value, 10) || 0 })
                }
                min={6}
                max={32}
              />
              <p className="text-xs text-muted-foreground">Allowed range: 6-32 characters</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialChars">Allowed Special Characters</Label>
              <Input
                id="specialChars"
                value={passwordRules.specialCharacters || ''}
                onChange={(e) =>
                  setPasswordRules({ ...passwordRules, specialCharacters: e.target.value })
                }
                placeholder="!@#$%^&*()"
              />
              <p className="text-xs text-muted-foreground">Used when special characters are required</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="requireUpper">Require Uppercase</Label>
              <Switch
                id="requireUpper"
                checked={passwordRules.requireUppercase}
                onCheckedChange={(checked) =>
                  setPasswordRules({ ...passwordRules, requireUppercase: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="requireLower">Require Lowercase</Label>
              <Switch
                id="requireLower"
                checked={passwordRules.requireLowercase}
                onCheckedChange={(checked) =>
                  setPasswordRules({ ...passwordRules, requireLowercase: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="requireNumber">Require Number</Label>
              <Switch
                id="requireNumber"
                checked={passwordRules.requireNumber}
                onCheckedChange={(checked) => setPasswordRules({ ...passwordRules, requireNumber: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="requireSpecial">Require Special Character</Label>
              <Switch
                id="requireSpecial"
                checked={passwordRules.requireSpecial}
                onCheckedChange={(checked) => setPasswordRules({ ...passwordRules, requireSpecial: checked })}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSavePasswordRules} disabled={savingSection === 'password'}>
              {savingSection === 'password' && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Save Password Rules
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-purple-400" />
            <div>
              <CardTitle>Username Rules</CardTitle>
              <CardDescription>Define allowed username format</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="usernameMin">Minimum Length</Label>
              <Input
                id="usernameMin"
                type="number"
                value={usernameRules.minLength}
                onChange={(e) =>
                  setUsernameRules({ ...usernameRules, minLength: parseInt(e.target.value, 10) || 0 })
                }
                min={3}
                max={50}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="usernameMax">Maximum Length</Label>
              <Input
                id="usernameMax"
                type="number"
                value={usernameRules.maxLength}
                onChange={(e) =>
                  setUsernameRules({ ...usernameRules, maxLength: parseInt(e.target.value, 10) || 0 })
                }
                min={3}
                max={50}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="allowSpecial">Allow Special Characters</Label>
              <p className="text-xs text-muted-foreground">Enable to permit non-alphanumeric usernames</p>
            </div>
            <Switch
              id="allowSpecial"
              checked={usernameRules.allowSpecial}
              onCheckedChange={(checked) =>
                setUsernameRules({ ...usernameRules, allowSpecial: checked })
              }
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveUsernameRules} disabled={savingSection === 'username'}>
              {savingSection === 'username' && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Save Username Rules
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-purple-400" />
            <div>
              <CardTitle>API Rate Limiting</CardTitle>
              <CardDescription>Protect the API by throttling request bursts</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="rateEnabled">Enable Rate Limiting</Label>
              <p className="text-xs text-muted-foreground">Applies globally across admin APIs</p>
            </div>
            <Switch
              id="rateEnabled"
              checked={rateLimit.enabled}
              onCheckedChange={(checked) => setRateLimit({ ...rateLimit, enabled: checked })}
            />
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxRequests">Max Requests</Label>
              <Input
                id="maxRequests"
                type="number"
                value={rateLimit.maxRequests}
                onChange={(e) =>
                  setRateLimit({ ...rateLimit, maxRequests: parseInt(e.target.value, 10) || 0 })
                }
                min={10}
                max={100000}
                disabled={!rateLimit.enabled}
              />
              <p className="text-xs text-muted-foreground">Allowed range: 10 - 100000</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="windowMinutes">Window (minutes)</Label>
              <Input
                id="windowMinutes"
                type="number"
                value={rateLimit.windowMinutes}
                onChange={(e) =>
                  setRateLimit({ ...rateLimit, windowMinutes: parseInt(e.target.value, 10) || 0 })
                }
                min={1}
                max={1440}
                disabled={!rateLimit.enabled}
              />
              <p className="text-xs text-muted-foreground">Backend stores window in milliseconds</p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveRateLimit} disabled={savingSection === 'rate'}>
              {savingSection === 'rate' && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Save Rate Limit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
