'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Users, 
  Lock, 
  UserPlus, 
  Loader2, 
  CheckCircle, 
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { EmployeeManagement } from '@/components/admin';

import { 
  userSettingsApi, 
  PasswordPolicy, 
  RegistrationPolicy, 
  LockoutRules, 
  PasswordValidationResult,
} from '@/service/admin';

export default function UserSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('password');

  // Password Policy State
  const [passwordPolicy, setPasswordPolicy] = useState<PasswordPolicy>({
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: false,
    preventCommonPasswords: true,
    preventUserInfo: true,
    expirationDays: 90,
    historyCount: 5,
  });

  // Registration Policy State
  const [registrationPolicy, setRegistrationPolicy] = useState<RegistrationPolicy>({
    allowSelfRegistration: false,
    requireEmailVerification: true,
    requireAdminApproval: true,
    allowedEmailDomains: [],
    blockedEmailDomains: [],
    defaultRole: 'EMPLOYEE',
    autoActivateAccounts: false,
    requireInvitation: true,
  });

  // Lockout Rules State
  const [lockoutRules, setLockoutRules] = useState<LockoutRules>({
    enabled: true,
    maxFailedAttempts: 5,
    lockoutDurationMinutes: 30,
    resetFailedAttemptsAfterMinutes: 60,
    notifyAdminOnLockout: true,
    allowSelfUnlock: false,
    progressiveDelay: true,
  });

  // Password Validation State
  const [testPassword, setTestPassword] = useState('');
  const [validationResult, setValidationResult] = useState<PasswordValidationResult | null>(null);

  useEffect(() => {
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    try {
      setLoading(true);
      const [passwordRes, registrationRes, lockoutRes] = await Promise.all([
        userSettingsApi.getPasswordPolicy(),
        userSettingsApi.getRegistrationPolicy(),
        userSettingsApi.getLockoutRules(),
      ]);
      
      if (passwordRes.data?.passwordPolicy) {
        setPasswordPolicy(passwordRes.data.passwordPolicy);
      }
      if (registrationRes.data?.registrationPolicy) {
        setRegistrationPolicy(registrationRes.data.registrationPolicy);
      }
      if (lockoutRes.data?.lockoutRules) {
        setLockoutRules(lockoutRes.data.lockoutRules);
      }

    } catch (error) {
      toast.error('Failed to load user settings');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePasswordPolicy = async () => {
    try {
      setSaving(true);
      await userSettingsApi.updatePasswordPolicy(passwordPolicy);
      toast.success('Password policy updated successfully');
    } catch (error) {
      toast.error('Failed to update password policy');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveRegistrationPolicy = async () => {
    try {
      setSaving(true);
      await userSettingsApi.updateRegistrationPolicy(registrationPolicy);
      toast.success('Registration policy updated successfully');
    } catch (error) {
      toast.error('Failed to update registration policy');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveLockoutRules = async () => {
    try {
      setSaving(true);
      await userSettingsApi.updateLockoutRules(lockoutRules);
      toast.success('Lockout rules updated successfully');
    } catch (error) {
      toast.error('Failed to update lockout rules');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleValidatePassword = async () => {
    if (!testPassword) return;

    try {
      const response = await userSettingsApi.validatePassword({
        password: testPassword,
        userInfo: { email: 'test@example.com', name: 'Test User' },
      });
      setValidationResult(response.data ?? null);
    } catch (error) {
      toast.error('Failed to validate password');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading user settings...</span>
      </div>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid w-full grid-cols-4 border border-white/20 bg-white/5 text-white/90 backdrop-blur-sm">
        <TabsTrigger
          value="password"
          className="flex items-center space-x-2 text-white/80 data-[state=active]:text-white data-[state=active]:border-purple-300/60 data-[state=active]:bg-purple-500/15"
        >
          <Shield className="w-4 h-4" />
          <span>Password Policy</span>
        </TabsTrigger>
        <TabsTrigger
          value="registration"
          className="flex items-center space-x-2 text-white/80 data-[state=active]:text-white data-[state=active]:border-purple-300/60 data-[state=active]:bg-purple-500/15"
        >
          <UserPlus className="w-4 h-4" />
          <span>Registration</span>
        </TabsTrigger>
        <TabsTrigger
          value="lockout"
          className="flex items-center space-x-2 text-white/80 data-[state=active]:text-white data-[state=active]:border-purple-300/60 data-[state=active]:bg-purple-500/15"
        >
          <Lock className="w-4 h-4" />
          <span>Lockout Rules</span>
        </TabsTrigger>
        <TabsTrigger
          value="employees"
          className="flex items-center space-x-2 text-white/80 data-[state=active]:text-white data-[state=active]:border-purple-300/60 data-[state=active]:bg-purple-500/15"
        >
          <Users className="w-4 h-4" />
          <span>Employees</span>
        </TabsTrigger>
      </TabsList>

      {/* Password Policy Tab */}
      <TabsContent value="password" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Password Policy Configuration</CardTitle>
            <CardDescription>
              Set password requirements and security rules for all users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Length Requirements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minLength">Minimum Length</Label>
                <Input
                  id="minLength"
                  type="number"
                  value={passwordPolicy.minLength}
                  onChange={(e) => setPasswordPolicy({ ...passwordPolicy, minLength: parseInt(e.target.value) })}
                  min="1"
                  max="128"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxLength">Maximum Length</Label>
                <Input
                  id="maxLength"
                  type="number"
                  value={passwordPolicy.maxLength}
                  onChange={(e) => setPasswordPolicy({ ...passwordPolicy, maxLength: parseInt(e.target.value) })}
                  min="1"
                  max="256"
                />
              </div>
            </div>

            {/* Character Requirements */}
            <div className="space-y-4">
              <h4 className="font-medium">Character Requirements</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="requireUppercase">Require Uppercase Letters</Label>
                  <Switch
                    id="requireUppercase"
                    checked={passwordPolicy.requireUppercase}
                    onCheckedChange={(checked) => setPasswordPolicy({ ...passwordPolicy, requireUppercase: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="requireLowercase">Require Lowercase Letters</Label>
                  <Switch
                    id="requireLowercase"
                    checked={passwordPolicy.requireLowercase}
                    onCheckedChange={(checked) => setPasswordPolicy({ ...passwordPolicy, requireLowercase: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="requireNumbers">Require Numbers</Label>
                  <Switch
                    id="requireNumbers"
                    checked={passwordPolicy.requireNumbers}
                    onCheckedChange={(checked) => setPasswordPolicy({ ...passwordPolicy, requireNumbers: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="requireSymbols">Require Special Characters</Label>
                  <Switch
                    id="requireSymbols"
                    checked={passwordPolicy.requireSymbols}
                    onCheckedChange={(checked) => setPasswordPolicy({ ...passwordPolicy, requireSymbols: checked })}
                  />
                </div>
              </div>
            </div>

            {/* Security Options */}
            <div className="space-y-4">
              <h4 className="font-medium">Security Options</h4>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="preventCommon">Prevent Common Passwords</Label>
                  <Switch
                    id="preventCommon"
                    checked={passwordPolicy.preventCommonPasswords}
                    onCheckedChange={(checked) => setPasswordPolicy({ ...passwordPolicy, preventCommonPasswords: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="preventUserInfo">Prevent User Info in Password</Label>
                  <Switch
                    id="preventUserInfo"
                    checked={passwordPolicy.preventUserInfo}
                    onCheckedChange={(checked) => setPasswordPolicy({ ...passwordPolicy, preventUserInfo: checked })}
                  />
                </div>
              </div>
            </div>

            {/* Expiration and History */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expirationDays">Password Expiration (days)</Label>
                <Input
                  id="expirationDays"
                  type="number"
                  value={passwordPolicy.expirationDays}
                  onChange={(e) => setPasswordPolicy({ ...passwordPolicy, expirationDays: parseInt(e.target.value) })}
                  min="0"
                />
                <p className="text-sm text-muted-foreground">0 = never expires</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="historyCount">Password History Count</Label>
                <Input
                  id="historyCount"
                  type="number"
                  value={passwordPolicy.historyCount}
                  onChange={(e) => setPasswordPolicy({ ...passwordPolicy, historyCount: parseInt(e.target.value) })}
                  min="0"
                />
                <p className="text-sm text-muted-foreground">Prevent reusing last N passwords</p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSavePasswordPolicy} disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Save Password Policy
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Password Validator */}
        <Card>
          <CardHeader>
            <CardTitle>Password Validator</CardTitle>
            <CardDescription>Test passwords against your current policy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                placeholder="Enter password to test"
                type="password"
              />
              <Button onClick={handleValidatePassword} disabled={!testPassword}>
                Validate
              </Button>
            </div>
            
            {validationResult && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  {validationResult.isValid ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="font-medium">
                    {validationResult.isValid ? 'Password Valid' : 'Password Invalid'}
                  </span>
                  <Badge variant={validationResult.isValid ? 'default' : 'destructive'}>
                   
                    Score: {validationResult.score}%
                  </Badge>
                </div>
                
                <Progress value={validationResult.score} className="w-full" />
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  {Object.entries(validationResult.requirements).map(([req, met]) => (
                    <div key={req} className="flex items-center space-x-1">
                      {met ? (
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      ) : (
                        <XCircle className="w-3 h-3 text-red-600" />
                      )}
                      <span className={met ? 'text-green-600' : 'text-red-600'}>
                        {req.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Registration Policy Tab */}
      <TabsContent value="registration" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Registration Policy</CardTitle>
            <CardDescription>
              Control how new users can register and join your organization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allowSelfReg">Allow Self Registration</Label>
                  <p className="text-sm text-muted-foreground">Users can register without invitation</p>
                </div>
                <Switch
                  id="allowSelfReg"
                  checked={registrationPolicy.allowSelfRegistration}
                  onCheckedChange={(checked) => setRegistrationPolicy({ ...registrationPolicy, allowSelfRegistration: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="requireVerification">Require Email Verification</Label>
                  <p className="text-sm text-muted-foreground">Users must verify email before activation</p>
                </div>
                <Switch
                  id="requireVerification"
                  checked={registrationPolicy.requireEmailVerification}
                  onCheckedChange={(checked) => setRegistrationPolicy({ ...registrationPolicy, requireEmailVerification: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="requireApproval">Require Admin Approval</Label>
                  <p className="text-sm text-muted-foreground">Admin must approve new registrations</p>
                </div>
                <Switch
                  id="requireApproval"
                  checked={registrationPolicy.requireAdminApproval}
                  onCheckedChange={(checked) => setRegistrationPolicy({ ...registrationPolicy, requireAdminApproval: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoActivate">Auto Activate Accounts</Label>
                  <p className="text-sm text-muted-foreground">Automatically activate new accounts</p>
                </div>
                <Switch
                  id="autoActivate"
                  checked={registrationPolicy.autoActivateAccounts}
                  onCheckedChange={(checked) => setRegistrationPolicy({ ...registrationPolicy, autoActivateAccounts: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="requireInvitation">Require Invitation</Label>
                  <p className="text-sm text-muted-foreground">Users need invitation to register</p>
                </div>
                <Switch
                  id="requireInvitation"
                  checked={registrationPolicy.requireInvitation}
                  onCheckedChange={(checked) => setRegistrationPolicy({ ...registrationPolicy, requireInvitation: checked })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultRole">Default Role</Label>
              <Select 
                value={registrationPolicy.defaultRole} 
                onValueChange={(value) => setRegistrationPolicy({ ...registrationPolicy, defaultRole: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EMPLOYEE">Employee</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveRegistrationPolicy} disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Save Registration Policy
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Lockout Rules Tab */}
      <TabsContent value="lockout" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Lockout Rules</CardTitle>
            <CardDescription>
              Configure account lockout behavior to prevent brute force attacks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableLockout">Enable Account Lockout</Label>
                <p className="text-sm text-muted-foreground">Lock accounts after failed attempts</p>
              </div>
              <Switch
                id="enableLockout"
                checked={lockoutRules.enabled}
                onCheckedChange={(checked) => setLockoutRules({ ...lockoutRules, enabled: checked })}
              />
            </div>

            {lockoutRules.enabled && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxAttempts">Max Failed Attempts</Label>
                    <Input
                      id="maxAttempts"
                      type="number"
                      value={lockoutRules.maxFailedAttempts}
                      onChange={(e) => setLockoutRules({ ...lockoutRules, maxFailedAttempts: parseInt(e.target.value) })}
                      min="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lockoutDuration">Lockout Duration (minutes)</Label>
                    <Input
                      id="lockoutDuration"
                      type="number"
                      value={lockoutRules.lockoutDurationMinutes}
                      onChange={(e) => setLockoutRules({ ...lockoutRules, lockoutDurationMinutes: parseInt(e.target.value) })}
                      min="1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resetAttempts">Reset Failed Attempts After (minutes)</Label>
                  <Input
                    id="resetAttempts"
                    type="number"
                    value={lockoutRules.resetFailedAttemptsAfterMinutes}
                    onChange={(e) => setLockoutRules({ ...lockoutRules, resetFailedAttemptsAfterMinutes: parseInt(e.target.value) })}
                    min="1"
                  />
                  <p className="text-sm text-muted-foreground">Reset attempt counter after this period of inactivity</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifyAdmin">Notify Admin on Lockout</Label>
                    <Switch
                      id="notifyAdmin"
                      checked={lockoutRules.notifyAdminOnLockout}
                      onCheckedChange={(checked) => setLockoutRules({ ...lockoutRules, notifyAdminOnLockout: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="allowSelfUnlock">Allow Self Unlock</Label>
                    <Switch
                      id="allowSelfUnlock"
                      checked={lockoutRules.allowSelfUnlock}
                      onCheckedChange={(checked) => setLockoutRules({ ...lockoutRules, allowSelfUnlock: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="progressiveDelay">Progressive Delay</Label>
                    <Switch
                      id="progressiveDelay"
                      checked={lockoutRules.progressiveDelay}
                      onCheckedChange={(checked) => setLockoutRules({ ...lockoutRules, progressiveDelay: checked })}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button onClick={handleSaveLockoutRules} disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Save Lockout Rules
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Employees Tab - Using EmployeeManagement Component */}
      <TabsContent value="employees">
        <EmployeeManagement />
      </TabsContent>
    </Tabs>
  );
}