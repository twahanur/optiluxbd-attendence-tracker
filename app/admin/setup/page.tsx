'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Building2, 
  Mail, 
  Users, 
  ArrowRight, 
  ArrowLeft,
  Loader2,
  AlertCircle,
  Rocket
} from 'lucide-react';
import { toast } from 'sonner';

interface SetupStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  completed: boolean;
}

export default function AdminSetupWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Setup form data
  const [setupData, setSetupData] = useState({
    company: {
      name: '',
      address: '',
      phone: '',
      email: ''
    },
    email: {
      host: '',
      port: 587,
      user: '',
      pass: '',
      from: ''
    },
    admin: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const steps: SetupStep[] = [
    {
      id: 'company',
      title: 'Company Information',
      description: 'Set up your company profile and basic information',
      icon: Building2,
      completed: false
    },
    {
      id: 'email',
      title: 'Email Configuration',
      description: 'Configure SMTP settings for system notifications',
      icon: Mail,
      completed: false
    },
    {
      id: 'admin',
      title: 'Admin Account',
      description: 'Create the main administrator account',
      icon: Users,
      completed: false
    }
  ];

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    try {
      setLoading(true);
      
      // Simulate API calls to save all setup data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsCompleted(true);
      toast.success('Admin setup completed successfully!');
    } catch (error: unknown) {
      console.error('Setup failed:', error);
      toast.error('Setup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateStep = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0: // Company info
        return !!(setupData.company.name && setupData.company.email && setupData.company.phone);
      case 1: // Email config
        return !!(setupData.email.host && setupData.email.user && setupData.email.from);
      case 2: // Admin account
        return !!(
          setupData.admin.name && 
          setupData.admin.email && 
          setupData.admin.password && 
          setupData.admin.password === setupData.admin.confirmPassword
        );
      default:
        return false;
    }
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  if (isCompleted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Setup Complete!</h2>
            <p className="text-gray-600 mb-6">
              Your admin panel has been successfully configured. You can now manage your attendance system.
            </p>
            <div className="flex justify-center space-x-4">
              <Button onClick={() => window.location.href = '/admin'}>
                <Rocket className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/admin/settings'}>
                View Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Setup Wizard</h1>
        <p className="text-gray-600">Let&apos;s get your attendance system configured in just a few steps</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Setup Progress</span>
          <span className="text-sm text-gray-500">{currentStep + 1} of {steps.length}</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Step Navigation */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep || validateStep(index);
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  isCompleted
                    ? 'bg-green-100 border-green-500 text-green-600'
                    : isActive
                    ? 'bg-blue-100 border-blue-500 text-blue-600'
                    : 'bg-gray-100 border-gray-300 text-gray-400'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <IconComponent className="w-5 h-5" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-2 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {React.createElement(steps[currentStep].icon, { className: "w-6 h-6" })}
            <span>{steps[currentStep].title}</span>
          </CardTitle>
          <CardDescription>{steps[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Company Information Step */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={setupData.company.name}
                    onChange={(e) => setSetupData({
                      ...setupData,
                      company: { ...setupData.company, name: e.target.value }
                    })}
                    placeholder="Your Company Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyPhone">Phone Number *</Label>
                  <Input
                    id="companyPhone"
                    value={setupData.company.phone}
                    onChange={(e) => setSetupData({
                      ...setupData,
                      company: { ...setupData.company, phone: e.target.value }
                    })}
                    placeholder="+880-XXX-XXXXXXX"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyEmail">Company Email *</Label>
                <Input
                  id="companyEmail"
                  type="email"
                  value={setupData.company.email}
                  onChange={(e) => setSetupData({
                    ...setupData,
                    company: { ...setupData.company, email: e.target.value }
                  })}
                  placeholder="contact@company.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyAddress">Address</Label>
                <Textarea
                  id="companyAddress"
                  value={setupData.company.address}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSetupData({
                    ...setupData,
                    company: { ...setupData.company, address: e.target.value }
                  })}
                  placeholder="Company address"
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Email Configuration Step */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  For Gmail, use your app-specific password, not your regular password.
                  Enable 2-factor authentication and generate an app password.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emailHost">SMTP Host *</Label>
                  <Input
                    id="emailHost"
                    value={setupData.email.host}
                    onChange={(e) => setSetupData({
                      ...setupData,
                      email: { ...setupData.email, host: e.target.value }
                    })}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailPort">Port</Label>
                  <Input
                    id="emailPort"
                    type="number"
                    value={setupData.email.port}
                    onChange={(e) => setSetupData({
                      ...setupData,
                      email: { ...setupData.email, port: parseInt(e.target.value) }
                    })}
                    placeholder="587"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emailUser">Username/Email *</Label>
                  <Input
                    id="emailUser"
                    value={setupData.email.user}
                    onChange={(e) => setSetupData({
                      ...setupData,
                      email: { ...setupData.email, user: e.target.value }
                    })}
                    placeholder="your-email@gmail.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailPass">Password *</Label>
                  <Input
                    id="emailPass"
                    type="password"
                    value={setupData.email.pass}
                    onChange={(e) => setSetupData({
                      ...setupData,
                      email: { ...setupData.email, pass: e.target.value }
                    })}
                    placeholder="App password"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="emailFrom">From Address *</Label>
                <Input
                  id="emailFrom"
                  value={setupData.email.from}
                  onChange={(e) => setSetupData({
                    ...setupData,
                    email: { ...setupData.email, from: e.target.value }
                  })}
                  placeholder="Attendance System <noreply@company.com>"
                />
              </div>
            </div>
          )}

          {/* Admin Account Step */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adminName">Full Name *</Label>
                  <Input
                    id="adminName"
                    value={setupData.admin.name}
                    onChange={(e) => setSetupData({
                      ...setupData,
                      admin: { ...setupData.admin, name: e.target.value }
                    })}
                    placeholder="Admin Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Email *</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={setupData.admin.email}
                    onChange={(e) => setSetupData({
                      ...setupData,
                      admin: { ...setupData.admin, email: e.target.value }
                    })}
                    placeholder="admin@company.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adminPassword">Password *</Label>
                  <Input
                    id="adminPassword"
                    type="password"
                    value={setupData.admin.password}
                    onChange={(e) => setSetupData({
                      ...setupData,
                      admin: { ...setupData.admin, password: e.target.value }
                    })}
                    placeholder="Strong password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={setupData.admin.confirmPassword}
                    onChange={(e) => setSetupData({
                      ...setupData,
                      admin: { ...setupData.admin, confirmPassword: e.target.value }
                    })}
                    placeholder="Confirm password"
                  />
                  {setupData.admin.password && setupData.admin.confirmPassword && 
                   setupData.admin.password !== setupData.admin.confirmPassword && (
                    <p className="text-sm text-red-600">Passwords do not match</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={!validateStep(currentStep) || loading}
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
          {currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
          {currentStep < steps.length - 1 && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
}