"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { emailSettingsApi, EmailTemplate } from "@/service/admin";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Custommail = ({
  templates,
}: {
  templates: Record<string, EmailTemplate>;
}) => {
  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    undefined,
  );

  const [currentTemplate, setCurrentTemplate] = useState<EmailTemplate>({
    subject: "",
    htmlBody: "",
    textBody: "",
    variables: [],
  });
  const [saving, setSaving] = useState(false);

  const handleSaveTemplate = async () => {
    try {
      setSaving(true);
      await emailSettingsApi.updateTemplate(
        selectedValue as string,
        currentTemplate,
      );
      toast.success("Email template updated successfully");
    } catch (error) {
      toast.error("Failed to update email template");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader className="">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle>Email System Test</CardTitle>
            <CardDescription>
              Send test emails to verify your configuration
            </CardDescription>
          </div>

          <Select value={selectedValue} onValueChange={setSelectedValue}>
            <SelectTrigger className="w-50">
              <SelectValue placeholder="Select template" />
            </SelectTrigger>

            <SelectContent>
              {Object.keys(templates).map((key) => (
                <SelectItem key={key} value={key}>
                  {key}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Template Selection */}

        {/* Template Editor */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="templateSubject">Email Subject</Label>
            <Input
              id="templateSubject"
              value={currentTemplate.subject}
              onChange={(e) =>
                setCurrentTemplate({
                  ...currentTemplate,
                  subject: e.target.value,
                })
              }
              placeholder="Email subject line"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="templateHtml">HTML Template</Label>
            <Textarea
              id="templateHtml"
              value={currentTemplate.htmlBody}
              onChange={(e) =>
                setCurrentTemplate({
                  ...currentTemplate,
                  htmlBody: e.target.value,
                })
              }
              placeholder="HTML email template with variables like {{employeeName}}"
              rows={8}
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="templateText">Plain Text Version</Label>
            <Textarea
              id="templateText"
              value={currentTemplate.textBody}
              onChange={(e) =>
                setCurrentTemplate({
                  ...currentTemplate,
                  textBody: e.target.value,
                })
              }
              placeholder="Plain text version of the email"
              rows={4}
            />
          </div>

          {/* Available Variables */}
          {currentTemplate.variables &&
            currentTemplate.variables.length > 0 && (
              <div className="space-y-2">
                <Label>Available Variables</Label>
                <div className="flex flex-wrap gap-2">
                  {currentTemplate.variables.map((variable) => (
                    <Badge
                      key={variable}
                      variant="secondary"
                      className="font-mono">
                      {`{{${variable}}}`}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Use these variables in your template - they will be replaced
                  with actual values when emails are sent.
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
  );
};

export default Custommail;
