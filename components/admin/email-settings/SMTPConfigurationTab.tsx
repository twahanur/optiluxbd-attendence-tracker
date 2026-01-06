import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import type { SMTPConfig } from "@/service/admin/email-settings";

interface SMTPConfigurationTabProps {
  smtpConfig: SMTPConfig | null;
  editingSMTP: boolean;
  setEditingSMTP: (value: boolean) => void;
  setSMTPConfig: (config: SMTPConfig) => void;
  onTestConnection: () => void;
  onSaveChanges: () => void;
}

export default function SMTPConfigurationTab({
  smtpConfig,
  editingSMTP,
  setEditingSMTP,
  setSMTPConfig,
  onTestConnection,
  onSaveChanges,
}: SMTPConfigurationTabProps) {
  if (!smtpConfig) return null;

  return (
    <TabsContent value="smtp">
      <Card>
        <CardHeader>
          <CardTitle>SMTP Configuration</CardTitle>
        </CardHeader>
        <CardContent>
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
                  <Button variant="outline" onClick={onTestConnection}>
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
                  <Button onClick={onSaveChanges}>Save Changes</Button>
                  <Button variant="outline" onClick={() => setEditingSMTP(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
