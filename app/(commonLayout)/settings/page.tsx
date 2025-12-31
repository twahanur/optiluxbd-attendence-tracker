'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Building2, 
  Mail, 
  Users, 
  Shield, 
  TestTube
} from 'lucide-react';

// Import tab components
import GeneralSettings from './components/GeneralSettings';
import CompanySettings from './components/CompanySettings';
import EmailSettings from './components/EmailSettings';
import UserSettings from './components/UserSettings';
import SystemHealth from './components/SystemHealth';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    {
      id: 'general',
      label: 'General Settings',
      icon: Settings,
      description: 'System-wide configuration and basic settings',
      component: GeneralSettings
    },
    {
      id: 'company',
      label: 'Company Settings',
      icon: Building2,
      description: 'Company profile, working hours, and holiday management',
      component: CompanySettings
    },
    {
      id: 'email',
      label: 'Email Settings',
      icon: Mail,
      description: 'SMTP configuration and email templates',
      component: EmailSettings
    },
    {
      id: 'user',
      label: 'User Management',
      icon: Users,
      description: 'User policies, password rules, and registration settings',
      component: UserSettings
    },
    {
      id: 'system',
      label: 'System Health',
      icon: TestTube,
      description: 'System status, email testing, and diagnostics',
      component: SystemHealth
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Settings</h1>
          <p className="text-gray-200 mt-2">Manage system configuration, company settings, and user policies</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-300 border-green-500/40">
            <Shield className="w-3 h-3 mr-1" />
            Admin Access
          </Badge>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-5 border border-white/20 bg-white/5 text-white/90 backdrop-blur-sm">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center space-x-2 text-white/80 data-[state=active]:text-white data-[state=active]:border-purple-300/60 data-[state=active]:bg-purple-500/15"
              >
                <IconComponent className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Tab Content */}
        {tabs.map((tab) => {
          const ComponentToRender = tab.component;
          return (
            <TabsContent key={tab.id} value={tab.id} className="space-y-6">
              <Card className="border-white/20">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <tab.icon className="w-6 h-6 text-purple-400" />
                    <div>
                      <CardTitle className="text-white">{tab.label}</CardTitle>
                      <CardDescription className="text-gray-200">{tab.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ComponentToRender />
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}