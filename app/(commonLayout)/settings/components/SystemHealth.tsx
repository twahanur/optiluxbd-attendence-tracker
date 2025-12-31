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
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'disconnected':
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'paused':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active':
        return <Badge className="text-green-300 border-green-500/40">Active</Badge>;
      case 'disconnected':
      case 'error':
        return <Badge className="text-red-300 border-red-500/40">Error</Badge>;
      case 'paused':
        return <Badge className="text-yellow-300 border-yellow-500/40">Paused</Badge>;
      default:
        return <Badge className="text-gray-300 border-gray-500/40">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
        <span className="ml-2 text-white">Loading system status...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-white">System Health Dashboard</h3>
          <p className="text-sm text-gray-200">
            Monitor system status, performance metrics, and test functionality
          </p>
        </div>
        <Button 
          onClick={handleRefreshStatus}
          disabled={refreshing}
          variant="outline"
          className="flex items-center space-x-2 border-white/20 text-white hover:border-white/40"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Status</span>
        </Button>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-200">System Uptime</p>
                <p className="text-lg font-semibold text-white">{systemMetrics.uptime}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-200">Active Users</p>
                <p className="text-lg font-semibold text-white">
                  {systemMetrics.activeUsers}/{systemMetrics.totalUsers}
                </p>
              </div>
              <Users className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-200">Database Size</p>
                <p className="text-lg font-semibold text-white">{systemMetrics.databaseSize}</p>
              </div>
              <Database className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-200">Email Status</p>
                <p className="text-lg font-semibold text-white">
                  {emailSystemStatus?.isConfigured ? 'Configured' : 'Not Set'}
                </p>
              </div>
              <Mail className={`w-8 h-8 ${emailSystemStatus?.isConfigured ? 'text-green-400' : 'text-red-400'}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email System Status */}
      {emailSystemStatus && (
        <Card className="border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Mail className="w-5 h-5" />
              <span>Email System Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Configuration Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-4 border border-white/20 bg-white/5 rounded-lg">
                {getStatusIcon(emailSystemStatus.smtpStatus)}
                <div>
                  <p className="font-medium text-white">SMTP Connection</p>
                  <p className="text-sm text-gray-200 capitalize">{emailSystemStatus.smtpStatus}</p>
                </div>
              </div>

              <div className="text-center p-4 border border-white/20 bg-white/5 rounded-lg">
                <p className="text-2xl font-bold text-purple-400">{emailSystemStatus.emailsSentToday}</p>
                <p className="text-sm text-gray-200">Emails Sent Today</p>
              </div>

              <div className="text-center p-4 border border-white/20 bg-white/5 rounded-lg">
                <p className={`text-2xl font-bold ${emailSystemStatus.failedEmailsToday > 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {emailSystemStatus.failedEmailsToday}
                </p>
                <p className="text-sm text-gray-200">Failed Emails Today</p>
              </div>
            </div>

            {/* Active Email Jobs */}
            <div>
              <h4 className="font-medium mb-3 text-white">Scheduled Email Jobs</h4>
              <div className="bg-white/5 border border-white/20 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/20 hover:bg-white/5">
                      <TableHead className="text-gray-200">Job Name</TableHead>
                      <TableHead className="text-gray-200">Schedule</TableHead>
                      <TableHead className="text-gray-200">Next Run</TableHead>
                      <TableHead className="text-gray-200">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {emailSystemStatus.activeJobs.map((job, index) => (
                      <TableRow key={index} className="border-white/20 hover:bg-white/5">
                        <TableCell className="font-medium text-white">{job.name}</TableCell>
                        <TableCell className="font-mono text-sm text-gray-200">{job.schedule}</TableCell>
                        <TableCell className="text-gray-200">{new Date(job.nextRun).toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(job.status)}</TableCell>
                      </TableRow>
                    ))}
                    {emailSystemStatus.activeJobs.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-gray-200 py-4">
                          No scheduled email jobs found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Email Test Form */}
            <Card className="border-dashed border-white/30 bg-white/5">
              <CardHeader>
                <CardTitle className="text-base text-white">Send Test Email</CardTitle>
                <CardDescription className="text-gray-200">
                  Test your email configuration by sending a test message
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="testEmailTo" className="text-white">Send To *</Label>
                    <Input
                      id="testEmailTo"
                      type="email"
                      value={testEmail.email}
                      onChange={(e) => setTestEmail({ ...testEmail, email: e.target.value })}
                      placeholder="admin@company.com"
                      className="border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="testEmailSubject" className="text-white">Subject</Label>
                    <Input
                      id="testEmailSubject"
                      value={testEmail.subject}
                      onChange={(e) => setTestEmail({ ...testEmail, subject: e.target.value })}
                      className="border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="testEmailMessage" className="text-white">Message</Label>
                  <Textarea
                    id="testEmailMessage"
                    value={testEmail.message}
                    onChange={(e) => setTestEmail({ ...testEmail, message: e.target.value })}
                    rows={3}
                    className="border-white/20 text-white placeholder:text-gray-400"
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
      <Card className="border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <TrendingUp className="w-5 h-5" />
            <span>System Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-white">Memory Usage</span>
                <span className="text-sm text-gray-200">{systemMetrics.memoryUsage}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${systemMetrics.memoryUsage > 80 ? 'bg-red-400' : systemMetrics.memoryUsage > 60 ? 'bg-yellow-400' : 'bg-green-400'}`}
                  style={{ width: `${systemMetrics.memoryUsage}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-white">CPU Usage</span>
                <span className="text-sm text-gray-200">{systemMetrics.cpuUsage}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${systemMetrics.cpuUsage > 80 ? 'bg-red-400' : systemMetrics.cpuUsage > 60 ? 'bg-yellow-400' : 'bg-green-400'}`}
                  style={{ width: `${systemMetrics.cpuUsage}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-white">Disk Usage</span>
                <span className="text-sm text-gray-200">{systemMetrics.diskUsage}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${systemMetrics.diskUsage > 80 ? 'bg-red-400' : systemMetrics.diskUsage > 60 ? 'bg-yellow-400' : 'bg-green-400'}`}
                  style={{ width: `${systemMetrics.diskUsage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card className="border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Settings className="w-5 h-5" />
            <span>System Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium text-white">Last System Backup</span>
                <span className="text-gray-200">
                  {new Date(systemMetrics.lastBackup).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-white">Total Registered Users</span>
                <span className="text-gray-200">{systemMetrics.totalUsers}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Database Size</span>
                <span className="text-muted-foreground">{systemMetrics.databaseSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-white">Database Size</span>
                <span className="text-gray-200">{systemMetrics.databaseSize}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium text-white">Email System</span>
                <span className={`${emailSystemStatus?.isConfigured ? 'text-green-400' : 'text-red-400'}`}>
                  {emailSystemStatus?.isConfigured ? 'Configured' : 'Not Configured'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-white">System Status</span>
                <span className="text-green-400">Healthy</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-white">Last Status Check</span>
                <span className="text-gray-200">
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
          <Alert className="border-yellow-500/40 text-yellow-200">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {emailSystemStatus.failedEmailsToday} email(s) failed to send today. Please check your SMTP configuration.
            </AlertDescription>
          </Alert>
        )}

        {systemMetrics.memoryUsage > 80 && (
          <Alert className="border-orange-500/40 text-orange-200">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Memory usage is high ({systemMetrics.memoryUsage}%). Consider monitoring system performance.
            </AlertDescription>
          </Alert>
        )}

        {!emailSystemStatus?.isConfigured && (
          <Alert className="border-amber-500/40 text-amber-200">
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