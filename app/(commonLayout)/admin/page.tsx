'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Users, 
  Mail, 
  Database, 
  Activity, 
  BarChart3,
  Shield,
  Clock,
  TrendingUp,
  Bell,
  FileText
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  // Mock data - in real app this would come from APIs
  const stats = {
    totalEmployees: 158,
    activeToday: 142,
    pendingApprovals: 5,
    systemHealth: 'Excellent',
    emailsSentToday: 45,
    uptime: '99.9%'
  };

  const quickActions = [
    {
      title: 'System Settings',
      description: 'Configure system-wide settings and preferences',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-blue-500'
    },
    {
      title: 'User Management',
      description: 'Manage user accounts, roles, and permissions',
      icon: Users,
      href: '/admin/users',
      color: 'bg-green-500'
    },
    {
      title: 'Reports',
      description: 'View attendance reports and analytics',
      icon: BarChart3,
      href: '/admin/reports',
      color: 'bg-purple-500'
    },
    {
      title: 'Email Configuration',
      description: 'Configure SMTP and email templates',
      icon: Mail,
      href: '/admin/settings?tab=email',
      color: 'bg-orange-500'
    }
  ];

  const recentActivity = [
    { type: 'user', message: 'New employee John Doe registered', time: '2 minutes ago' },
    { type: 'system', message: 'Daily attendance reminder sent', time: '1 hour ago' },
    { type: 'security', message: 'Password policy updated', time: '3 hours ago' },
    { type: 'backup', message: 'System backup completed', time: '6 hours ago' }
  ];

  const systemAlerts = [
    { type: 'info', message: 'System maintenance scheduled for next week' },
    { type: 'warning', message: '5 employees pending approval' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-200 mt-2">Manage your attendance system and organization settings</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-300 border-green-500/40">
            <Shield className="w-3 h-3 mr-1" />
            Admin Access
          </Badge>
          <Badge variant="outline" className="text-blue-300 border-blue-500/40">
            <Activity className="w-3 h-3 mr-1" />
            System Healthy
          </Badge>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-200">Total Employees</p>
                <p className="text-2xl font-bold text-white">{stats.totalEmployees}</p>
                <p className="text-xs text-green-400">+3 this month</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-200">Active Today</p>
                <p className="text-2xl font-bold text-white">{stats.activeToday}</p>
                <p className="text-xs text-green-400">89.9% attendance</p>
              </div>
              <Activity className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-200">Pending Approvals</p>
                <p className="text-2xl font-bold text-white">{stats.pendingApprovals}</p>
                <p className="text-xs text-orange-400">Requires action</p>
              </div>
              <Bell className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-200">System Uptime</p>
                <p className="text-2xl font-bold text-white">{stats.uptime}</p>
                <p className="text-xs text-green-400">Excellent</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
          <CardDescription className="text-gray-200">Common administrative tasks and system configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Link key={index} href={action.href}>
                  <Card className="border-white/20 hover:border-white/40 transition-all cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${action.color} text-white`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-white">{action.title}</h4>
                          <p className="text-xs text-gray-200 mt-1">{action.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Clock className="w-5 h-5" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 border border-white/20 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-white">{activity.message}</p>
                  <p className="text-xs text-gray-200">{activity.time}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4 border-white/20 text-white hover:border-white/40">
              View All Activity
            </Button>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card className="border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Bell className="w-5 h-5" />
              <span>System Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {systemAlerts.map((alert, index) => (
              <div key={index} className={`p-3 rounded-lg border ${
                alert.type === 'warning' ? 'border-yellow-500/40 text-yellow-200' : 'border-blue-500/40 text-blue-200'
              }`}>
                <p className="text-sm">{alert.message}</p>
              </div>
            ))}
            
            {/* System Health Summary */}
            <div className="mt-4 p-4 border border-green-500/40 rounded-lg">
              <h4 className="font-medium text-green-300 mb-2">System Health: Excellent</h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-green-200">
                <div>• Email System: Active</div>
                <div>• Database: Healthy</div>
                <div>• API: Responding</div>
                <div>• Backups: Current</div>
              </div>
            </div>

            <Button variant="outline" className="w-full mt-4 border-white/20 text-white hover:border-white/40">
              View System Status
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Cards */}
      <Card className="border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Administrative Sections</CardTitle>
          <CardDescription className="text-gray-200">Navigate to different areas of the admin panel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/settings">
              <Card className="border-white/20 hover:border-white/40 transition-all cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Settings className="w-12 h-12 mx-auto mb-3 text-blue-400" />
                  <h3 className="font-medium mb-2 text-white">System Settings</h3>
                  <p className="text-sm text-gray-200">
                    Configure company profile, working hours, email settings, and user policies
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/reports">
              <Card className="border-white/20 hover:border-white/40 transition-all cursor-pointer">
                <CardContent className="p-6 text-center">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-green-400" />
                  <h3 className="font-medium mb-2 text-white">Reports & Analytics</h3>
                  <p className="text-sm text-gray-200">
                    View attendance reports, analytics, and generate custom reports
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Card className="border-white/20 hover:border-white/40 transition-all cursor-pointer opacity-75">
              <CardContent className="p-6 text-center">
                <Database className="w-12 h-12 mx-auto mb-3 text-purple-400" />
                <h3 className="font-medium mb-2 text-white">Data Management</h3>
                <p className="text-sm text-gray-200">
                  Backup, restore, and manage system data (Coming Soon)
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}