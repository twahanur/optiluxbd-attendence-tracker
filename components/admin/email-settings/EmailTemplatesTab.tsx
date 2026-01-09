import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import type { EmailTemplate } from "@/service/admin/email-settings";

interface EmailTemplatesTabProps {
  templates: Record<string, EmailTemplate>;
  editingTemplate: string | null;
  setEditingTemplate: (templateName: string | null) => void;
  setTemplates: (templates: Record<string, EmailTemplate>) => void;
  onTemplateUpdate: (templateName: string) => void;
}

export default function EmailTemplatesTab({
  templates,
  editingTemplate,
  setEditingTemplate,
  setTemplates,
  onTemplateUpdate,
}: EmailTemplatesTabProps) {
  return (
    <TabsContent value="templates">
      <div className="space-y-4">
        {Object.keys(templates).length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">No email templates found. Please check your API connection.</p>
            </CardContent>
          </Card>
        ) : (
          Object.entries(templates).map(([templateName, template]) => (
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
                      <Button onClick={() => onTemplateUpdate(templateName)}>Save Template</Button>
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
          ))
        )}
      </div>
    </TabsContent>
  );
}
