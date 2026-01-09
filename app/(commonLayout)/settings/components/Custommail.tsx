/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { userSettingsApi } from "@/service/admin/user-settings";
import { Loader2, Search, X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Employee {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  employeeId?: string;
}

interface SendCustomEmailRequest {
  userId: string;
  templateType: string;
  subject?: string;
  html?: string;
  variables?: Record<string, string>;
}

const Custommail = ({
  templates,
}: {
  templates: Record<string, EmailTemplate>;
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | undefined>(
    undefined,
  );
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Employee[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);

  const [currentTemplate, setCurrentTemplate] = useState<EmailTemplate>({
    subject: "",
    htmlBody: "",
    textBody: "",
    variables: [],
  });
  const [saving, setSaving] = useState(false);

  // Load all employees on component mount
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const response = await userSettingsApi.getAllEmployees(1, 100);
        if (response.success && response.data?.employees) {
          const employees: Employee[] = response.data.employees.map((emp: any) => ({
            id: emp.id,
            email: emp.email,
            firstName: emp.firstName,
            lastName: emp.lastName,
            phoneNumber: emp.phoneNumber || undefined,
            employeeId: emp.employeeId,
          }));
          setAllEmployees(employees);
        }
      } catch (error) {
        console.error("Failed to load employees:", error);
      }
    };
    loadEmployees();
  }, []);

  // Search employees based on query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = allEmployees.filter((employee) => {
      return (
        employee.email.toLowerCase().includes(query) ||
        employee.firstName.toLowerCase().includes(query) ||
        employee.lastName.toLowerCase().includes(query) ||
        `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(query) ||
        employee.phoneNumber?.toLowerCase().includes(query) ||
        employee.employeeId?.toLowerCase().includes(query)
      );
    });

    setSearchResults(filtered);
    setShowSearchResults(true);
  }, [searchQuery, allEmployees]);

  const handleSelectEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const handleRemoveEmployee = () => {
    setSelectedEmployee(null);
  };

  const handleSendEmail = async () => {
    if (!selectedEmployee) {
      toast.error("Please select an employee");
      return;
    }

    if (!selectedTemplate) {
      toast.error("Please select a template");
      return;
    }

    if (
      selectedTemplate === "CUSTOM" &&
      (!currentTemplate.subject || !currentTemplate.htmlBody)
    ) {
      toast.error("Subject and email body are required for custom templates");
      return;
    }

    try {
      setSaving(true);

      // Prepare the email request body
      const emailRequest: SendCustomEmailRequest = {
        userId: selectedEmployee.id,
        templateType: selectedTemplate,
      };

      // For CUSTOM template, add subject and html body
      if (selectedTemplate === "CUSTOM") {
        emailRequest.subject = currentTemplate.subject;
        emailRequest.html = currentTemplate.htmlBody;
        // Optionally include plain text as a variable
        if (currentTemplate.textBody) {
          emailRequest.variables = {
            customPlainText: currentTemplate.textBody,
          };
        }
      } else {
        // For predefined templates, include variables
        emailRequest.variables = currentTemplate.variables?.reduce(
          (acc, variable) => ({
            ...acc,
            [variable]: "",
          }),
          {},
        );
      }

      // Send email using sentCustomEmail
      const response = await emailSettingsApi.sentCustomEmail(emailRequest);

      if (!response.success) {
        throw new Error(response.message || "Failed to send email");
      }

      toast.success("Email sent successfully");
      setSelectedEmployee(null);
      setSelectedTemplate(undefined);
      setCurrentTemplate({
        subject: "",
        htmlBody: "",
        textBody: "",
        variables: [],
      });
    } catch (error) {
      toast.error("Failed to send email");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleTemplateChange = (templateType: string) => {
    setSelectedTemplate(templateType);
    // Reset form when template changes
    if (templateType === "CUSTOM") {
      setCurrentTemplate({
        subject: "",
        htmlBody: "",
        textBody: "",
        variables: [],
      });
    } else {
      // Load template variables if available
      const template = templates[templateType];
      if (template) {
        setCurrentTemplate(template);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="space-y-1">
          <CardTitle>Send Custom Email</CardTitle>
          <CardDescription>
            Send emails to employees using custom templates or predefined
            templates
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Employee Search Section */}
        <div className="space-y-3">
          <Label>Select Employee</Label>
          {!selectedEmployee ? (
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by email, name, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="border border-white/20 rounded-md shadow-lg max-h-48 overflow-y-auto bg-white/10 backdrop-blur-sm z-10">
                  {searchResults.map((employee) => (
                    <div
                      key={employee.id}
                      className="p-3 border-b border-white/10 hover:bg-white/5 cursor-pointer transition"
                      onClick={() => handleSelectEmployee(employee)}
                    >
                      <div className="font-semibold text-white">
                        {employee.firstName} {employee.lastName}
                      </div>
                      <div className="text-sm text-white/70">{employee.email}</div>
                      {employee.phoneNumber && (
                        <div className="text-sm text-white/60">
                          {employee.phoneNumber}
                        </div>
                      )}
                      {employee.employeeId && (
                        <div className="text-xs text-white/50">
                          ID: {employee.employeeId}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {showSearchResults &&
                searchResults.length === 0 &&
                searchQuery && (
                  <div className="p-2 text-sm text-white/60">
                    No employees found
                  </div>
                )}
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 border border-purple-500/30 rounded-md bg-purple-500/10 backdrop-blur-sm">
              <div>
                <div className="font-semibold text-white">
                  {selectedEmployee.firstName} {selectedEmployee.lastName}
                </div>
                <div className="text-sm text-white/70">{selectedEmployee.email}</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveEmployee}
                className="ml-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Template Selection */}
        <div className="space-y-3">
          <Label>Template Type</Label>
          <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CUSTOM">Custom Email</SelectItem>
              {Object.keys(templates).map((key) => (
                <SelectItem key={key} value={key}>
                  {key}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Template Editor - Show only for CUSTOM template */}
        {selectedTemplate === "CUSTOM" && (
          <div className="space-y-4 border-t pt-6">
            <div className="space-y-2">
              <Label htmlFor="templateSubject">Email Subject *</Label>
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
              <Label htmlFor="templateHtml">HTML Template *</Label>
              <Textarea
                id="templateHtml"
                value={currentTemplate.htmlBody}
                onChange={(e) =>
                  setCurrentTemplate({
                    ...currentTemplate,
                    htmlBody: e.target.value,
                  })
                }
                placeholder="HTML email template"
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
          </div>
        )}

        {/* Template Info - Show for predefined templates */}
        {selectedTemplate && selectedTemplate !== "CUSTOM" && (
          <div className="space-y-4 border-t border-white/10 pt-6">
            <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-md backdrop-blur-sm">
              <Label className="font-semibold mb-2 text-white">Template Details</Label>
              <div className="mt-2 space-y-2 text-sm text-white/80">
                <div>
                  <span className="font-medium">Subject:</span>{" "}
                  {currentTemplate.subject}
                </div>
                {currentTemplate.variables &&
                  currentTemplate.variables.length > 0 && (
                    <div>
                      <span className="font-medium">Required Variables:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {currentTemplate.variables.map((variable) => (
                          <Badge key={variable} variant="secondary">
                            {`{{${variable}}}`}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        )}

        {/* Send Button */}
        <div className="flex justify-end gap-2 border-t pt-6">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedEmployee(null);
              setSelectedTemplate(undefined);
              setCurrentTemplate({
                subject: "",
                htmlBody: "",
                textBody: "",
                variables: [],
              });
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendEmail}
            disabled={saving || !selectedEmployee || !selectedTemplate}
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Send Email
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Custommail;
