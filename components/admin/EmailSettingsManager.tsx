"use client";

import { useEffect, useState } from "react";
import {
  getSMTPConfig,
  updateSMTPConfig,
  testSMTPConnection,
  getAllTemplates,
  updateTemplate,
  getEmailSystemStatus,
  sendTestEmail,
  type SMTPConfig,
  type EmailTemplate,
  type EmailTemplates,
  type EmailSystemStatus,
} from "@/service/admin/email-settings";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function EmailSettingsManager() {
  const [smtpConfig, setSMTPConfig] = useState<SMTPConfig | null>(null);
  const [templates, setTemplates] = useState<Record<string, EmailTemplate>>({});
  const [emailStatus, setEmailStatus] = useState<EmailSystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingSMTP, setEditingSMTP] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [testEmail, setTestEmail] = useState({ email: "", subject: "", message: "" });

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [smtpRes, templatesRes, statusRes] = await Promise.all([
          getSMTPConfig(),
          getAllTemplates(),
          getEmailSystemStatus(),
        ]);

        if (smtpRes.success && smtpRes.data) {
          setSMTPConfig(smtpRes.data.smtp);
        } else {
          setError(smtpRes.message || "Failed to fetch SMTP config");
        }

        if (templatesRes.success && templatesRes.data) {
          setTemplates(templatesRes.data.templates);
        }

        if (statusRes.success && statusRes.data) {
          setEmailStatus(statusRes.data.emailSystem);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred while fetching email settings");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle SMTP update
  const handleSMTPUpdate = async () => {
    try {
      setError(null);
      if (!smtpConfig) return;

      const response = await updateSMTPConfig(smtpConfig);

      if (response.success) {
        setEditingSMTP(false);
        setSuccessMessage("SMTP configuration updated successfully");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.message || "Failed to update SMTP config");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while updating SMTP config");
    }
  };

  // Handle test SMTP connection
  const handleTestSMTP = async () => {
    try {
      setError(null);
      const response = await testSMTPConnection();

      if (response.success && response.data) {
        setSuccessMessage(`SMTP Test Successful: ${response.data.serverResponse}`);
        setTimeout(() => setSuccessMessage(null), 5000);
      } else {
        setError("SMTP connection test failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while testing SMTP connection");
    }
  };

  // Handle template update
  const handleTemplateUpdate = async (templateName: string) => {
    try {
      setError(null);
      const template = templates[templateName];
      if (!template) return;

      const validTemplateNames: Array<keyof EmailTemplates> = [
        "attendanceReminder",
        "passwordReset",
        "dailyReport",
        "weeklyReport",
        "systemNotification",
      ];
      
      if (!validTemplateNames.includes(templateName as keyof EmailTemplates)) {
        setError("Invalid template name");
        return;
      }

      const response = await updateTemplate(templateName as keyof EmailTemplates, template);

      if (response.success) {
        setEditingTemplate(null);
        setSuccessMessage(`${templateName} template updated successfully`);
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.message || "Failed to update template");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while updating template");
    }
  };

  // Handle send test email
  const handleSendTestEmail = async () => {
    try {
      setError(null);

      if (!testEmail.email || !testEmail.subject || !testEmail.message) {
        setError("Please fill in all required fields");
        return;
      }

      const response = await sendTestEmail(testEmail);

      if (response.success) {
        setTestEmail({ email: "", subject: "", message: "" });
        setSuccessMessage("Test email sent successfully");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.message || "Failed to send test email");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while sending test email");
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <p className="text-lg text-gray-500">Loading email settings...</p>
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

      <Tabs defaultValue="smtp" className="w-full">
        <TabsList>
          <TabsTrigger value="smtp">SMTP Configuration</TabsTrigger>
          <TabsTrigger value="templates">Email Templates</TabsTrigger>
          <TabsTrigger value="status">System Status</TabsTrigger>
          <TabsTrigger value="test">Send Test Email</TabsTrigger>
        </TabsList>

        {/* SMTP Configuration Tab */}
        <TabsContent value="smtp">
          <Card>
            <CardHeader>
              <CardTitle>SMTP Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              {smtpConfig && (
                <div className="space-y-4">
                  {!editingSMTP ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Host</p>
                          <p className="text-lg font-semibold">{smtpConfig.host}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Port</p>
                          <p className="text-lg font-semibold">{smtpConfig.port}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">User</p>
                          <p className="text-lg font-semibold">{smtpConfig.user}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">From Address</p>
                          <p className="text-lg font-semibold">{smtpConfig.from}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Secure</p>
                        <span
                          className={`inline-block px-3 py-1 rounded text-sm font-semibold ${
                            smtpConfig.secure ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {smtpConfig.secure ? "Yes (TLS)" : "No"}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => setEditingSMTP(true)}>Edit SMTP Config</Button>
                        <Button variant="outline" onClick={handleTestSMTP}>
                          Test Connection
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold mb-2">Host</label>
                          <Input
                            value={smtpConfig.host}
                            onChange={(e) => setSMTPConfig({ ...smtpConfig, host: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2">Port</label>
                          <Input
                            type="number"
                            value={smtpConfig.port}
                            onChange={(e) => setSMTPConfig({ ...smtpConfig, port: parseInt(e.target.value) })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2">User</label>
                          <Input
                            value={smtpConfig.user}
                            onChange={(e) => setSMTPConfig({ ...smtpConfig, user: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2">Password</label>
                          <Input
                            type="password"
                            placeholder="Enter password"
                            onChange={(e) => setSMTPConfig({ ...smtpConfig, pass: e.target.value })}
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm font-semibold mb-2">From Address</label>
                          <Input
                            value={smtpConfig.from}
                            onChange={(e) => setSMTPConfig({ ...smtpConfig, from: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2">Secure (TLS)</label>
                          <select
                            value={smtpConfig.secure ? "true" : "false"}
                            onChange={(e) => setSMTPConfig({ ...smtpConfig, secure: e.target.value === "true" })}
                            className="w-full border rounded px-3 py-2"
                          >
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSMTPUpdate}>Save Changes</Button>
                        <Button variant="outline" onClick={() => setEditingSMTP(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Templates Tab */}
        <TabsContent value="templates">
          <div className="space-y-4">
            {Object.entries(templates).map(([templateName, template]) => (
              <Card key={templateName}>
                <CardHeader>
                  <CardTitle className="capitalize">{templateName.replace(/([A-Z])/g, " $1")}</CardTitle>
                </CardHeader>
                <CardContent>
                  {editingTemplate === templateName ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Subject</label>
                        <Input
                          value={template.subject}
                          onChange={(e) =>
                            setTemplates({
                              ...templates,
                              [templateName]: { ...template, subject: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">HTML Content</label>
                        <textarea
                          value={template.html}
                          onChange={(e) =>
                            setTemplates({
                              ...templates,
                              [templateName]: { ...template, html: e.target.value },
                            })
                          }
                          className="w-full border rounded px-3 py-2 min-h-48 font-mono text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Text Content</label>
                        <textarea
                          value={template.text}
                          onChange={(e) =>
                            setTemplates({
                              ...templates,
                              [templateName]: { ...template, text: e.target.value },
                            })
                          }
                          className="w-full border rounded px-3 py-2 min-h-32 font-mono text-sm"
                        />
                      </div>
                      {template.variables && template.variables.length > 0 && (
                        <div>
                          <label className="block text-sm font-semibold mb-2">Available Variables</label>
                          <div className="flex flex-wrap gap-2">
                            {template.variables.map((variable) => (
                              <span key={variable} className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                                {`{{${variable}}}`}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button onClick={() => handleTemplateUpdate(templateName)}>Save Template</Button>
                        <Button variant="outline" onClick={() => setEditingTemplate(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Subject</p>
                        <p className="text-lg font-semibold">{template.subject}</p>
                      </div>
                      {template.variables && template.variables.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Available Variables</p>
                          <div className="flex flex-wrap gap-2">
                            {template.variables.map((variable) => (
                              <span key={variable} className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                                {`{{${variable}}}`}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <Button onClick={() => setEditingTemplate(templateName)}>Edit Template</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Email System Status Tab */}
        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Email System Status</CardTitle>
            </CardHeader>
            <CardContent>
              {emailStatus && (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="border rounded p-4">
                      <p className="text-sm text-gray-500 mb-2">System Status</p>
                      <span
                        className={`inline-block px-3 py-1 rounded text-sm font-semibold ${
                          emailStatus.isConfigured
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {emailStatus.isConfigured ? "Configured" : "Not Configured"}
                      </span>
                    </div>
                    <div className="border rounded p-4">
                      <p className="text-sm text-gray-500 mb-2">SMTP Status</p>
                      <span
                        className={`inline-block px-3 py-1 rounded text-sm font-semibold ${
                          emailStatus.smtpStatus === "connected"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {emailStatus.smtpStatus.charAt(0).toUpperCase() + emailStatus.smtpStatus.slice(1)}
                      </span>
                    </div>
                    <div className="border rounded p-4">
                      <p className="text-sm text-gray-500 mb-2">Emails Today</p>
                      <p className="text-2xl font-bold">{emailStatus.emailsSentToday}</p>
                    </div>
                  </div>

                  <div className="border rounded p-4">
                    <p className="text-sm text-gray-500 mb-2">Failed Emails Today</p>
                    <p className="text-2xl font-bold text-red-600">{emailStatus.failedEmailsToday}</p>
                  </div>

                  {emailStatus.lastTestTime && (
                    <div className="border rounded p-4">
                      <p className="text-sm text-gray-500 mb-2">Last Test Time</p>
                      <p className="text-lg">{new Date(emailStatus.lastTestTime).toLocaleString()}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold mb-4">Active Jobs</h3>
                    {emailStatus.activeJobs.length > 0 ? (
                      <div className="space-y-3">
                        {emailStatus.activeJobs.map((job) => (
                          <div key={job.name} className="border rounded p-4">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-semibold">{job.name}</p>
                              <span
                                className={`px-2 py-1 rounded text-xs font-semibold ${
                                  job.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : job.status === "paused"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">Schedule: {job.schedule}</p>
                            <p className="text-sm text-gray-600">
                              Next Run: {new Date(job.nextRun).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No active jobs</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Send Test Email Tab */}
        <TabsContent value="test">
          <Card>
            <CardHeader>
              <CardTitle>Send Test Email</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-sm font-semibold mb-2">Recipient Email</label>
                  <Input
                    type="email"
                    placeholder="test@example.com"
                    value={testEmail.email}
                    onChange={(e) => setTestEmail({ ...testEmail, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Subject</label>
                  <Input
                    placeholder="Test Email Subject"
                    value={testEmail.subject}
                    onChange={(e) => setTestEmail({ ...testEmail, subject: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Message</label>
                  <textarea
                    placeholder="Test email message"
                    value={testEmail.message}
                    onChange={(e) => setTestEmail({ ...testEmail, message: e.target.value })}
                    className="w-full border rounded px-3 py-2 min-h-32"
                  />
                </div>
                <Button onClick={handleSendTestEmail}>Send Test Email</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
