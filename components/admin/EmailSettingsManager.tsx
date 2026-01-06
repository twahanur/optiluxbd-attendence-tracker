/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  SMTPConfigurationTab,
  EmailTemplatesTab,
  EmailSystemStatusTab,
  SendTestEmailTab,
} from "./email-settings";

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
        
        console.log("📧 Fetching email settings...");
        
        const [smtpRes, templatesRes, statusRes] = await Promise.all([
          getSMTPConfig(),
          getAllTemplates(),
          getEmailSystemStatus(),
        ]);
        
        console.log("📊 API Responses:", { smtpRes, templatesRes, statusRes });

        if (smtpRes.success && smtpRes.data) {
          setSMTPConfig(smtpRes.data.smtp);
        } else {
          setError(smtpRes.message || "Failed to fetch SMTP config");
        }

        console.log("📧 Templates Response:", templatesRes);
        
        if (templatesRes.success && templatesRes.data) {
          console.log("📧 Raw templates data:", templatesRes.data);
          // Map API response to component format
          const mappedTemplates: Record<string, EmailTemplate> = {};
          Object.entries(templatesRes.data).forEach(([key, value]: [string, any]) => {
            if (key !== 'count' && key !== 'message' && key !== 'success' && value && typeof value === 'object') {
              // Convert snake_case to camelCase
              const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
              console.log(`🔄 Mapping ${key} → ${camelKey}`, value);
              mappedTemplates[camelKey] = {
                subject: value.subject || '',
                html: value.htmlBody || value.html || '',
                text: value.textBody || value.text || '',
                variables: value.variables || []
              };
            }
          });
          console.log("✅ Mapped templates:", mappedTemplates);
          setTemplates(mappedTemplates);
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

  console.log("afeter uise effect")

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

      // Convert camelCase to snake_case for API
      const snakeCaseTemplateName = templateName.replace(/([A-Z])/g, '_$1').toLowerCase();
      
      // Map template format from component to API format
      const apiTemplate = {
        subject: template.subject,
        htmlBody: template.html,
        textBody: template.text,
        variables: template.variables
      };

      const response = await updateTemplate(snakeCaseTemplateName as keyof EmailTemplates, apiTemplate as any);

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

        <SMTPConfigurationTab
          smtpConfig={smtpConfig}
          editingSMTP={editingSMTP}
          setEditingSMTP={setEditingSMTP}
          setSMTPConfig={setSMTPConfig}
          onTestConnection={handleTestSMTP}
          onSaveChanges={handleSMTPUpdate}
        />

        <EmailTemplatesTab
          templates={templates}
          editingTemplate={editingTemplate}
          setEditingTemplate={setEditingTemplate}
          setTemplates={setTemplates}
          onTemplateUpdate={handleTemplateUpdate}
        />

        <EmailSystemStatusTab emailStatus={emailStatus} />

        <SendTestEmailTab
          testEmail={testEmail}
          setTestEmail={setTestEmail}
          onSendTestEmail={handleSendTestEmail}
        />
      </Tabs>
    </div>
  );
}
