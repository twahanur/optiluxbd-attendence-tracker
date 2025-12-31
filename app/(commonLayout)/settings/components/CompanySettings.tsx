'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Clock, Calendar, Building2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { 
  companySettingsApi, 
  CompanyProfile, 
  WorkingHours, 
  Holiday 
} from '@/service/admin';

export default function CompanySettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // Company Profile State
  const [profile, setProfile] = useState<CompanyProfile>({
    name: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    industry: '',
    description: '',
    logo: '',
  });

  // Working Hours State
  const [workingHours, setWorkingHours] = useState<WorkingHours>({
    monday: { start: '09:00', end: '17:00', isWorkingDay: true },
    tuesday: { start: '09:00', end: '17:00', isWorkingDay: true },
    wednesday: { start: '09:00', end: '17:00', isWorkingDay: true },
    thursday: { start: '09:00', end: '17:00', isWorkingDay: true },
    friday: { start: '09:00', end: '17:00', isWorkingDay: true },
    saturday: { start: '09:00', end: '13:00', isWorkingDay: false },
    sunday: { start: '00:00', end: '00:00', isWorkingDay: false },
    timezone: 'Asia/Dhaka',
    lunchBreakStart: '12:00',
    lunchBreakEnd: '13:00',
  });

  // Holidays State
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [newHoliday, setNewHoliday] = useState<Omit<Holiday, 'id'>>({
    name: '',
    date: '',
    type: 'public',
    description: '',
  });
  const [showNewHolidayForm, setShowNewHolidayForm] = useState(false);

  useEffect(() => {
    loadCompanyData();
  }, []);

  const loadCompanyData = async () => {
    try {
      setLoading(true);
      const [profileRes, workingHoursRes, holidaysRes] = await Promise.all([
        companySettingsApi.getProfile(),
        companySettingsApi.getWorkingHours(),
        companySettingsApi.getHolidays(),
      ]);

      if (profileRes.data?.profile) {
        setProfile(profileRes.data.profile);
      }
      if (workingHoursRes.data?.workingHours) {
        setWorkingHours(workingHoursRes.data.workingHours);
      }
      if (holidaysRes.data?.holidays) {
        setHolidays(holidaysRes.data.holidays);
      }
    } catch (error) {
      toast.error('Failed to load company settings');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      await companySettingsApi.updateProfile(profile);
      toast.success('Company profile updated successfully');
    } catch (error) {
      toast.error('Failed to update company profile');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveWorkingHours = async () => {
    try {
      setSaving(true);
      await companySettingsApi.updateWorkingHours(workingHours);
      toast.success('Working hours updated successfully');
    } catch (error) {
      toast.error('Failed to update working hours');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddHoliday = async () => {
    if (!newHoliday.name || !newHoliday.date) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      setSaving(true);
      await companySettingsApi.addHoliday(newHoliday);
      toast.success('Holiday added successfully');
      setNewHoliday({ name: '', date: '', type: 'public', description: '' });
      setShowNewHolidayForm(false);
      loadCompanyData();
    } catch (error) {
      toast.error('Failed to add holiday');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteHoliday = async (id: number) => {
    if (!confirm('Are you sure you want to delete this holiday?')) return;

    try {
      await companySettingsApi.deleteHoliday(id);
      toast.success('Holiday deleted successfully');
      loadCompanyData();
    } catch (error) {
      toast.error('Failed to delete holiday');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading company settings...</span>
      </div>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid w-full grid-cols-3 border border-white/20 bg-white/5 text-white/90 backdrop-blur-sm">
        <TabsTrigger
          value="profile"
          className="flex items-center space-x-2 text-white/80 data-[state=active]:text-white data-[state=active]:border-purple-300/60 data-[state=active]:bg-purple-500/15"
        >
          <Building2 className="w-4 h-4" />
          <span>Company Profile</span>
        </TabsTrigger>
        <TabsTrigger
          value="hours"
          className="flex items-center space-x-2 text-white/80 data-[state=active]:text-white data-[state=active]:border-purple-300/60 data-[state=active]:bg-purple-500/15"
        >
          <Clock className="w-4 h-4" />
          <span>Working Hours</span>
        </TabsTrigger>
        <TabsTrigger
          value="holidays"
          className="flex items-center space-x-2 text-white/80 data-[state=active]:text-white data-[state=active]:border-purple-300/60 data-[state=active]:bg-purple-500/15"
        >
          <Calendar className="w-4 h-4" />
          <span>Holidays</span>
        </TabsTrigger>
      </TabsList>

      {/* Company Profile Tab */}
      <TabsContent value="profile" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>
              Update your company profile and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Company Name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={profile.industry}
                  onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                  placeholder="e.g., Technology, Healthcare"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                placeholder="Company address"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="+1-555-123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="contact@company.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={profile.website}
                  onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                  placeholder="https://www.company.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo">Logo URL</Label>
                <Input
                  id="logo"
                  value={profile.logo}
                  onChange={(e) => setProfile({ ...profile, logo: e.target.value })}
                  placeholder="https://company.com/logo.png"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={profile.description}
                onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                placeholder="Company description"
                rows={4}
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveProfile} disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Save Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Working Hours Tab */}
      <TabsContent value="hours" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Working Hours Configuration</CardTitle>
            <CardDescription>
              Set working hours for each day of the week and lunch break times
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Days of Week */}
            <div className="space-y-4">
              <h4 className="font-medium">Weekly Schedule</h4>
              {Object.entries(workingHours).slice(0, 7).map(([day, hours]) => (
                <div key={day} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="w-20">
                    <span className="font-medium capitalize">{day}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={hours.isWorkingDay}
                      onCheckedChange={(checked) => 
                        setWorkingHours({
                          ...workingHours,
                          [day]: { ...hours, isWorkingDay: checked }
                        })
                      }
                    />
                    <span className="text-sm">Working Day</span>
                  </div>
                  {hours.isWorkingDay && (
                    <>
                      <div className="flex items-center space-x-2">
                        <Label>Start:</Label>
                        <Input
                          type="time"
                          value={hours.start}
                          onChange={(e) => 
                            setWorkingHours({
                              ...workingHours,
                              [day]: { ...hours, start: e.target.value }
                            })
                          }
                          className="w-32"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Label>End:</Label>
                        <Input
                          type="time"
                          value={hours.end}
                          onChange={(e) => 
                            setWorkingHours({
                              ...workingHours,
                              [day]: { ...hours, end: e.target.value }
                            })
                          }
                          className="w-32"
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            <Separator />

            {/* Lunch Break and Timezone */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lunchStart">Lunch Break Start</Label>
                <Input
                  id="lunchStart"
                  type="time"
                  value={workingHours.lunchBreakStart}
                  onChange={(e) => setWorkingHours({ ...workingHours, lunchBreakStart: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lunchEnd">Lunch Break End</Label>
                <Input
                  id="lunchEnd"
                  type="time"
                  value={workingHours.lunchBreakEnd}
                  onChange={(e) => setWorkingHours({ ...workingHours, lunchBreakEnd: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select 
                  value={workingHours.timezone} 
                  onValueChange={(value) => setWorkingHours({ ...workingHours, timezone: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Dhaka">Asia/Dhaka</SelectItem>
                    <SelectItem value="Asia/Karachi">Asia/Karachi</SelectItem>
                    <SelectItem value="Asia/Kolkata">Asia/Kolkata</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">America/New_York</SelectItem>
                    <SelectItem value="Europe/London">Europe/London</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveWorkingHours} disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Save Working Hours
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Holidays Tab */}
      <TabsContent value="holidays" className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Holiday Calendar</CardTitle>
                <CardDescription>
                  Manage public and company holidays for attendance tracking
                </CardDescription>
              </div>
              <Button 
                onClick={() => setShowNewHolidayForm(!showNewHolidayForm)}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Holiday</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* New Holiday Form */}
            {showNewHolidayForm && (
              <Card className="border-dashed">
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="holidayName">Holiday Name *</Label>
                      <Input
                        id="holidayName"
                        value={newHoliday.name}
                        onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
                        placeholder="e.g., Independence Day"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="holidayDate">Date *</Label>
                      <Input
                        id="holidayDate"
                        type="date"
                        value={newHoliday.date}
                        onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="holidayType">Type</Label>
                      <Select 
                        value={newHoliday.type} 
                        onValueChange={(value: 'public' | 'private') => setNewHoliday({ ...newHoliday, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public Holiday</SelectItem>
                          <SelectItem value="private">Company Holiday</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="holidayDescription">Description</Label>
                      <Input
                        id="holidayDescription"
                        value={newHoliday.description}
                        onChange={(e) => setNewHoliday({ ...newHoliday, description: e.target.value })}
                        placeholder="Optional description"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button onClick={handleAddHoliday} disabled={saving}>
                      {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                      Add Holiday
                    </Button>
                    <Button variant="outline" onClick={() => setShowNewHolidayForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Holidays Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Holiday Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-25">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {holidays.map((holiday) => (
                  <TableRow key={holiday.id}>
                    <TableCell className="font-medium">{holiday.name}</TableCell>
                    <TableCell>{new Date(holiday.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={holiday.type === 'public' ? 'default' : 'secondary'}>
                        {holiday.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {holiday.description || 'No description'}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => holiday.id && handleDeleteHoliday(holiday.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {holidays.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                      No holidays configured. Add your first holiday above.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}