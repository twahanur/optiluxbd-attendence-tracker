import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";

interface SendTestEmailTabProps {
  testEmail: { email: string; subject: string; message: string };
  setTestEmail: (email: { email: string; subject: string; message: string }) => void;
  onSendTestEmail: () => void;
}

export default function SendTestEmailTab({ testEmail, setTestEmail, onSendTestEmail }: SendTestEmailTabProps) {
  return (
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
            <Button onClick={onSendTestEmail}>Send Test Email</Button>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
