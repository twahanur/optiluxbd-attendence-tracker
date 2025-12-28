'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Activity, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Mail, 
  Database, 
  Loader2,
  RefreshCw,
  Send,
  TrendingUp,
  Users,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

import { 
  emailSettingsApi, 
  EmailSystemStatus,
  TestEmailRequest 
} from '@/service/admin';

export default function SystemHealth() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [testing, setTesting] = useState(false);

  // System Status State
  const [emailSystemStatus, setEmailSystemStatus] = useState<EmailSystemStatus | null>(null);

  // Test Email State
  const [testEmail, setTestEmail] = useState<TestEmailRequest>({
    email: '',
    subject: 'System Health Test Email',
    message: 'This is a test email sent from the admin settings to verify email functionality.',
  });

  // Mock system metrics (in real app, these would come from APIs)
  const [systemMetrics] = useState({
    uptime: '15 days, 3 hours',
    activeUsers: 142,
    totalUsers: 158,
    databaseSize: '2.3 GB',
    lastBackup: '2025-12-28T02:00:00.000Z',
    memoryUsage: 68,
    cpuUsage: 23,
    diskUsage: 45,
  });

  useEffect(() => {
    loadSystemStatus();
  }, []);

  const loadSystemStatus = async () => {
    try {
      setLoading(true);
      const emailStatusRes = await emailSettingsApi.getSystemStatus();
      if(emailStatusRes && emailStatusRes.data)
      setEmailSystemStatus(emailStatusRes.data.emailSystem);
    } catch (error) {
      toast.error('Failed to load system status');
      console.error('Error loading system status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshStatus = async () => {
    try {
      setRefreshing(true);
      await loadSystemStatus();
      toast.success('System status refreshed');
    } catch {
      toast.error('Failed to refresh system status');
    } finally {
      setRefreshing(false);
    }
  };

  const handleSendTestEmail = async () => {
    if (!testEmail.email) {
      toast.error('Please enter an email address');
      return;
    }

    try {
      setTesting(true);
      await emailSettingsApi.sendTestEmail(testEmail);
      toast.success('Test email sent successfully!');
      setTestEmail({ ...testEmail, email: '' });
    } catch (error) {
      toast.error('Failed to send test email');
      console.error(error);
    } finally {
      setTesting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'disconnected':
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'paused':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'disconnected':
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'paused':
        return <Badge variant="secondary">Paused</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading system status...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">System Health Dashboard</h3>
          <p className="text-sm text-muted-foreground">
            Monitor system status, performance metrics, and test functionality
          </p>
        </div>
        <Button 
          onClick={handleRefreshStatus}
          disabled={refreshing}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Status</span>
        </Button>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">System Uptime</p>
                <p className="text-lg font-semibold">{systemMetrics.uptime}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-lg font-semibold">
                  {systemMetrics.activeUsers}/{systemMetrics.totalUsers}
                </p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Database Size</p>
                <p className="text-lg font-semibold">{systemMetrics.databaseSize}</p>
              </div>
              <Database className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Email Status</p>
                <p className="text-lg font-semibold">
                  {emailSystemStatus?.isConfigured ? 'Configured' : 'Not Set'}
                </p>
              </div>
              <Mail className={`w-8 h-8 ${emailSystemStatus?.isConfigured ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email System Status */}
      {emailSystemStatus && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="w-5 h-5" />
              <span>Email System Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Configuration Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-4 border rounded-lg">
                {getStatusIcon(emailSystemStatus.smtpStatus)}
                <div>
                  <p className="font-medium">SMTP Connection</p>
                  <p className="text-sm text-muted-foreground capitalize">{emailSystemStatus.smtpStatus}</p>
                </div>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold text-primary">{emailSystemStatus.emailsSentToday}</p>
                <p className="text-sm text-muted-foreground">Emails Sent Today</p>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <p className={`text-2xl font-bold ${emailSystemStatus.failedEmailsToday > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {emailSystemStatus.failedEmailsToday}
                </p>
                <p className="text-sm text-muted-foreground">Failed Emails Today</p>
              </div>
            </div>

            {/* Active Email Jobs */}
            <div>
              <h4 className="font-medium mb-3">Scheduled Email Jobs</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Name</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Next Run</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emailSystemStatus.activeJobs.map((job, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{job.name}</TableCell>
                      <TableCell className="font-mono text-sm">{job.schedule}</TableCell>
                      <TableCell>{new Date(job.nextRun).toLocaleString()}</TableCell>
                      <TableCell>{getStatusBadge(job.status)}</TableCell>
                    </TableRow>
                  ))}
                  {emailSystemStatus.activeJobs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-4">
                        No scheduled email jobs found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Email Test Form */}
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="text-base">Send Test Email</CardTitle>
                <CardDescription>
                  Test your email configuration by sending a test message
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="testEmailTo">Send To *</Label>
                    <Input
                      id="testEmailTo"
                      type="email"
                      value={testEmail.email}
                      onChange={(e) => setTestEmail({ ...testEmail, email: e.target.value })}
                      placeholder="admin@company.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="testEmailSubject">Subject</Label>
                    <Input
                      id="testEmailSubject"
                      value={testEmail.subject}
                      onChange={(e) => setTestEmail({ ...testEmail, subject: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="testEmailMessage">Message</Label>
                  <Textarea
                    id="testEmailMessage"
                    value={testEmail.message}
                    onChange={(e) => setTestEmail({ ...testEmail, message: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSendTestEmail} 
                    disabled={testing || !testEmail.email || !emailSystemStatus.isConfigured}
                  >
                    {testing && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    <Send className="w-4 h-4 mr-2" />
                    Send Test Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}

      {/* System Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>System Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Memory Usage</span>
                <span className="text-sm text-muted-foreground">{systemMetrics.memoryUsage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${systemMetrics.memoryUsage > 80 ? 'bg-red-600' : systemMetrics.memoryUsage > 60 ? 'bg-yellow-600' : 'bg-green-600'}`}
                  style={{ width: `${systemMetrics.memoryUsage}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">CPU Usage</span>
                <span className="text-sm text-muted-foreground">{systemMetrics.cpuUsage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${systemMetrics.cpuUsage > 80 ? 'bg-red-600' : systemMetrics.cpuUsage > 60 ? 'bg-yellow-600' : 'bg-green-600'}`}
                  style={{ width: `${systemMetrics.cpuUsage}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Disk Usage</span>
                <span className="text-sm text-muted-foreground">{systemMetrics.diskUsage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${systemMetrics.diskUsage > 80 ? 'bg-red-600' : systemMetrics.diskUsage > 60 ? 'bg-yellow-600' : 'bg-green-600'}`}
                  style={{ width: `${systemMetrics.diskUsage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>System Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Last System Backup</span>
                <span className="text-muted-foreground">
                  {new Date(systemMetrics.lastBackup).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total Registered Users</span>
                <span className="text-muted-foreground">{systemMetrics.totalUsers}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Database Size</span>
                <span className="text-muted-foreground">{systemMetrics.databaseSize}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Email System</span>
                <span className={`${emailSystemStatus?.isConfigured ? 'text-green-600' : 'text-red-600'}`}>
                  {emailSystemStatus?.isConfigured ? 'Configured' : 'Not Configured'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">System Status</span>
                <span className="text-green-600">Healthy</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Last Status Check</span>
                <span className="text-muted-foreground">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Alerts */}
      <div className="space-y-3">
        {emailSystemStatus?.failedEmailsToday && emailSystemStatus.failedEmailsToday > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {emailSystemStatus.failedEmailsToday} email(s) failed to send today. Please check your SMTP configuration.
            </AlertDescription>
          </Alert>
        )}

        {systemMetrics.memoryUsage > 80 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Memory usage is high ({systemMetrics.memoryUsage}%). Consider monitoring system performance.
            </AlertDescription>
          </Alert>
        )}

        {!emailSystemStatus?.isConfigured && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Email system is not configured. Please configure SMTP settings to enable email notifications.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}