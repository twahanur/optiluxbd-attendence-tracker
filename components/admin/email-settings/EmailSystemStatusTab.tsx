import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import type { EmailSystemStatus } from "@/service/admin/email-settings";

interface EmailSystemStatusTabProps {
  emailStatus: EmailSystemStatus | null;
}

export default function EmailSystemStatusTab({ emailStatus }: EmailSystemStatusTabProps) {
  if (!emailStatus) return null;

  return (
    <TabsContent value="status">
      <Card>
        <CardHeader>
          <CardTitle>Email System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="border rounded p-4">
                <p className="text-sm text-gray-500 mb-2">System Status</p>
                <span
                  className={`inline-block px-3 py-1 rounded text-sm font-semibold ${
                    emailStatus.isConfigured ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
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
        </CardContent>
      </Card>
    </TabsContent>
  );
}
