'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Mail, 
  Server, 
  TestTube, 
  BookTemplate, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner';

import { 
  emailSettingsApi, 
  SMTPConfig, 
  EmailTemplate, 
  EmailTemplates 
} from '@/service/admin';

export default function EmailSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [activeTab, setActiveTab] = useState('smtp');
  const [showPassword, setShowPassword] = useState(false);

  // SMTP Configuration State
  const [smtpConfig, setSMTPConfig] = useState<SMTPConfig>({
    host: '',
    port: 587,
    secure: false,
    user: '',
    pass: '',
    from: '',
    isConfigured: false,
  });

  // Email Templates State
  const [templates, setTemplates] = useState<Partial<EmailTemplates>>({});
  const [selectedTemplate, setSelectedTemplate] = useState<keyof EmailTemplates>('attendanceReminder');
  const [currentTemplate, setCurrentTemplate] = useState<EmailTemplate>({
    subject: '',
    html: '',
    text: '',
    variables: [],
  });

  // Test Email State
  const [testEmail, setTestEmail] = useState({
    email: '',
    subject: 'Test Email from Attendance System',
    message: 'This is a test email to verify the email configuration.',
  });

  useEffect(() => {
    loadEmailSettings();
  }, []);

  const loadEmailSettings = async () => {
    try {
      setLoading(true);
      const [smtpRes, templatesRes] = await Promise.all([
        emailSettingsApi.getSMTPConfig(),
        emailSettingsApi.getAllTemplates(),
      ]);

      if (smtpRes.data?.smtp) {
        setSMTPConfig(smtpRes.data.smtp);
      }
      
      if (templatesRes.data?.templates) {
        setTemplates(templatesRes.data.templates);
        
        // Load first available template
        const firstTemplate = Object.keys(templatesRes.data.templates)[0] as keyof EmailTemplates;
        if (firstTemplate) {
          setSelectedTemplate(firstTemplate);
          setCurrentTemplate(templatesRes.data.templates[firstTemplate] || {
            subject: '',
            html: '',
            text: '',
            variables: [],
          });
        }
      }
    } catch (error) {
      toast.error('Failed to load email settings');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSMTP = async () => {
    try {
      setSaving(true);
      await emailSettingsApi.updateSMTPConfig(smtpConfig);
      toast.success('SMTP configuration saved successfully');
      loadEmailSettings(); // Reload to get updated status
    } catch (error) {
      toast.error('Failed to save SMTP configuration');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleTestSMTP = async () => {
    try {
      setTesting(true);
      const response = await emailSettingsApi.testSMTPConnection();
      
      if (response.success) {
        toast.success('SMTP connection test successful!');
      } else {
        toast.error('SMTP connection test failed');
      }
    } catch (error) {
      toast.error('SMTP connection test failed');
      console.error(error);
    } finally {
      setTesting(false);
    }
  };

  const handleSaveTemplate = async () => {
    try {
      setSaving(true);
      await emailSettingsApi.updateTemplate(selectedTemplate, currentTemplate);
      toast.success('Email template updated successfully');
      loadEmailSettings();
    } catch (error) {
      toast.error('Failed to update email template');
      console.error(error);
    } finally {
      setSaving(false);
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

  const handleTemplateChange = (templateName: keyof EmailTemplates) => {
    setSelectedTemplate(templateName);
    const template = templates[templateName];
    if (template) {
      setCurrentTemplate(template);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading email settings...</span>
      </div>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="smtp" className="flex items-center space-x-2">
          <Server className="w-4 h-4" />
          <span>SMTP Config</span>
        </TabsTrigger>
        <TabsTrigger value="templates" className="flex items-center space-x-2">
          <BookTemplate className="w-4 h-4" />
          <span>Templates</span>
        </TabsTrigger>
        <TabsTrigger value="test" className="flex items-center space-x-2">
          <TestTube className="w-4 h-4" />
          <span>Test & Status</span>
        </TabsTrigger>
      </TabsList>

      {/* SMTP Configuration Tab */}
      <TabsContent value="smtp" className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>SMTP Configuration</CardTitle>
                <CardDescription>
                  Configure your email server settings for sending notifications
                </CardDescription>
              </div>
              <Badge variant={smtpConfig.isConfigured ? 'default' : 'secondary'}>
                {smtpConfig.isConfigured ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Configured
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3 mr-1" />
                    Not Configured
                  </>
                )}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtpHost">SMTP Host *</Label>
                <Input
                  id="smtpHost"
                  value={smtpConfig.host}
                  onChange={(e) => setSMTPConfig({ ...smtpConfig, host: e.target.value })}
                  placeholder="smtp.gmail.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPort">Port *</Label>
                <Input
                  id="smtpPort"
                  type="number"
                  value={smtpConfig.port}
                  onChange={(e) => setSMTPConfig({ ...smtpConfig, port: parseInt(e.target.value) })}
                  placeholder="587"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="smtpUser">Username/Email *</Label>
              <Input
                id="smtpUser"
                value={smtpConfig.user}
                onChange={(e) => setSMTPConfig({ ...smtpConfig, user: e.target.value })}
                placeholder="your-email@gmail.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="smtpPass">Password/App Password *</Label>
              <div className="relative">
                <Input
                  id="smtpPass"
                  type={showPassword ? 'text' : 'password'}
                  value={smtpConfig.pass}
                  onChange={(e) => setSMTPConfig({ ...smtpConfig, pass: e.target.value })}
                  placeholder={smtpConfig.pass ? '***hidden***' : 'Your app password'}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="smtpFrom">From Address *</Label>
              <Input
                id="smtpFrom"
                value={smtpConfig.from}
                onChange={(e) => setSMTPConfig({ ...smtpConfig, from: e.target.value })}
                placeholder="Attendance System <noreply@company.com>"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={smtpConfig.secure}
                onCheckedChange={(checked) => setSMTPConfig({ ...smtpConfig, secure: checked })}
              />
              <Label>Use TLS/SSL (recommended for port 465)</Label>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                For Gmail, use your app-specific password, not your regular password. 
                Enable 2-factor authentication and generate an app password in your Google Account settings.
              </AlertDescription>
            </Alert>

            <div className="flex items-center space-x-2">
              <Button onClick={handleSaveSMTP} disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Save Configuration
              </Button>
              <Button variant="outline" onClick={handleTestSMTP} disabled={testing || !smtpConfig.host}>
                {testing && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Test Connection
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Email Templates Tab */}
      <TabsContent value="templates" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Email Templates</CardTitle>
            <CardDescription>
              Customize email templates for different notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Template Selection */}
            <div className="flex flex-wrap gap-2">
              {Object.keys(templates).map((templateName) => (
                <Button
                  key={templateName}
                  variant={selectedTemplate === templateName ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleTemplateChange(templateName as keyof EmailTemplates)}
                  className="capitalize"
                >
                  {templateName.replace(/([A-Z])/g, ' $1').trim()}
                </Button>
              ))}
            </div>

            {/* Template Editor */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="templateSubject">Email Subject</Label>
                <Input
                  id="templateSubject"
                  value={currentTemplate.subject}
                  onChange={(e) => setCurrentTemplate({ ...currentTemplate, subject: e.target.value })}
                  placeholder="Email subject line"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="templateHtml">HTML Template</Label>
                <Textarea
                  id="templateHtml"
                  value={currentTemplate.html}
                  onChange={(e) => setCurrentTemplate({ ...currentTemplate, html: e.target.value })}
                  placeholder="HTML email template with variables like {{employeeName}}"
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="templateText">Plain Text Version</Label>
                <Textarea
                  id="templateText"
                  value={currentTemplate.text}
                  onChange={(e) => setCurrentTemplate({ ...currentTemplate, text: e.target.value })}
                  placeholder="Plain text version of the email"
                  rows={4}
                />
              </div>

              {/* Available Variables */}
              {currentTemplate.variables && currentTemplate.variables.length > 0 && (
                <div className="space-y-2">
                  <Label>Available Variables</Label>
                  <div className="flex flex-wrap gap-2">
                    {currentTemplate.variables.map((variable) => (
                      <Badge key={variable} variant="secondary" className="font-mono">
                        {`{{${variable}}}`}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Use these variables in your template - they will be replaced with actual values when emails are sent.
                  </p>
                </div>
              )}

              <div className="flex justify-end">
                <Button onClick={handleSaveTemplate} disabled={saving}>
                  {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Save Template
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Test & Status Tab */}
      <TabsContent value="test" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Email System Test</CardTitle>
            <CardDescription>
              Send test emails to verify your configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="testEmailTo">Send Test Email To *</Label>
                <Input
                  id="testEmailTo"
                  type="email"
                  value={testEmail.email}
                  onChange={(e) => setTestEmail({ ...testEmail, email: e.target.value })}
                  placeholder="test@example.com"
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
                rows={4}
              />
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={handleSendTestEmail} 
                disabled={testing || !testEmail.email || !smtpConfig.isConfigured}
              >
                {testing && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                <Mail className="w-4 h-4 mr-2" />
                Send Test Email
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>Email System Status</CardTitle>
            <CardDescription>
              Current status of your email configuration and recent activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  {smtpConfig.isConfigured ? (
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-600" />
                  )}
                </div>
                <div className="text-sm font-medium">SMTP Status</div>
                <div className="text-xs text-muted-foreground">
                  {smtpConfig.isConfigured ? 'Connected' : 'Not Configured'}
                </div>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {Object.keys(templates).length}
                </div>
                <div className="text-sm font-medium">Email Templates</div>
                <div className="text-xs text-muted-foreground">Configured</div>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {smtpConfig.port}
                </div>
                <div className="text-sm font-medium">SMTP Port</div>
                <div className="text-xs text-muted-foreground">
                  {smtpConfig.secure ? 'Secure' : 'Standard'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}