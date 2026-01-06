'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Edit, Save, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { settingsApi, Setting, CreateSettingRequest } from '@/service/admin';

export default function GeneralSettings() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [newSetting, setNewSetting] = useState<CreateSettingRequest>({
    key: '',
    value: '',
    category: '',
    description: '',
  });
  const [showNewForm, setShowNewForm] = useState(false);

  // Load all settings
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      console.log('Starting to load settings...');
      
      const response = await settingsApi.getAll();
      console.log('Full API Response:', response);
      console.log('Response type:', typeof response);
      console.log('Response.data:', response?.data);
      console.log('Response.data type:', typeof response?.data);
      console.log('Is response.data an array?', Array.isArray(response?.data));
      
      if (!response) {
        toast.error('No response from server');
        console.error('No response received');
        return;
      }
      
      if (!response.success) {
        toast.error(response.message || 'Failed to load settings');
        console.error('API returned error:', response);
        return;
      }
      
      // Handle various response structures from different API versions
      let settingsData: Setting[] = [];
      
      // Structure 1: Backend returns { success, data: [...settings array...], count }
      if (response.data && Array.isArray(response.data)) {
        console.log('Detected array data structure');
        settingsData = response.data;
      } 
      // Structure 2: Mock API returns { success, data: { settings: [...], categories: [...] } }
      else if (response.data && typeof response.data === 'object' && 'settings' in response.data && Array.isArray((response.data as { settings: Setting[] }).settings)) {
        console.log('Detected nested settings structure');
        settingsData = (response.data as { settings: Setting[] }).settings;
      }
      // Structure 3: Response is directly an array (unlikely but handle it)
      else if (Array.isArray(response)) {
        console.log('Detected direct array response');
        settingsData = response as unknown as Setting[];
      }
      else {
        console.error('Unknown response structure:', response);
        console.error('response.data keys:', response.data ? Object.keys(response.data) : 'no data');
        toast.error('Unexpected data format from server');
        return;
      }
      
      console.log('Settings data extracted:', settingsData.length, 'items');
      
      // Extract unique categories from settings
      const uniqueCategories = [...new Set(settingsData.map(s => s.category))].sort();
      
      console.log('Setting state with', settingsData.length, 'settings and', uniqueCategories.length, 'categories');
      
      setSettings(settingsData);
      setCategories(uniqueCategories);
      
      console.log('State updated successfully');

    } catch (error) {
      toast.error('Failed to load settings');
      console.error('Settings load error:', error);
    } finally {
      setLoading(false);
      console.log('Loading complete');
    }
  };

  const handleCreateSetting = async () => {
    if (!newSetting.key || !newSetting.value || !newSetting.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      await settingsApi.create(newSetting);
      toast.success('Setting created successfully');
      setNewSetting({ key: '', value: '', category: '', description: '' });
      setShowNewForm(false);
      loadSettings();
    } catch (error) {
      toast.error('Failed to create setting');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateSetting = async (setting: Setting, newValue: string) => {
    try {
      setSaving(true);
      await settingsApi.update(setting.key, newValue);
      toast.success('Setting updated successfully');
      setEditingId(null);
      loadSettings();
    } catch (error) {
      toast.error('Failed to update setting');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSetting = async (key: string) => {
    if (!confirm('Are you sure you want to delete this setting?')) return;

    try {
      await settingsApi.delete(key);
      toast.success('Setting deleted successfully');
      loadSettings();
    } catch (error) {
      toast.error('Failed to delete setting');
      console.error(error);
    }
  };

  const groupedSettings = settings.reduce((acc, setting) => {
    if (!acc[setting.category]) {
      acc[setting.category] = [];
    }
    acc[setting.category].push(setting);
    return acc;
  }, {} as Record<string, Setting[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading settings...</span>
      </div>
    );
  }

  // Empty state when no settings are found
  if (settings.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">System Settings</h3>
            <p className="text-sm text-muted-foreground">
              Manage all system-wide configuration settings
            </p>
          </div>
          <Button 
            onClick={() => setShowNewForm(!showNewForm)}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Setting</span>
          </Button>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No settings found</p>
            <Button onClick={loadSettings} variant="outline">
              Retry Loading
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">System Settings</h3>
          <p className="text-sm text-muted-foreground">
            Manage all system-wide configuration settings
          </p>
        </div>
        <Button 
          onClick={() => setShowNewForm(!showNewForm)}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Setting</span>
        </Button>
      </div>

      {/* New Setting Form */}
      {showNewForm && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-base">Add New Setting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="key">Setting Key *</Label>
                <Input
                  id="key"
                  value={newSetting.key}
                  onChange={(e) => setNewSetting({ ...newSetting, key: e.target.value })}
                  placeholder="e.g., company.name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={newSetting.category} 
                  onValueChange={(value) => setNewSetting({ ...newSetting, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                    <SelectItem value="new">Create New Category</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Value *</Label>
              <Input
                id="value"
                value={newSetting.value}
                onChange={(e) => setNewSetting({ ...newSetting, value: e.target.value })}
                placeholder="Setting value"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newSetting.description}
                onChange={(e) => setNewSetting({ ...newSetting, description: e.target.value })}
                placeholder="Optional description"
                rows={2}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={handleCreateSetting} disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Create Setting
              </Button>
              <Button variant="outline" onClick={() => setShowNewForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings by Category */}
      <div className="space-y-6">
        {Object.entries(groupedSettings).map(([category, categorySettings]) => (
          <Card key={category}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg capitalize">{category} Settings</CardTitle>
                  <CardDescription>
                    {categorySettings.length} setting{categorySettings.length !== 1 ? 's' : ''}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="capitalize">
                  {category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Key</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="w-25">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categorySettings.map((setting) => (
                    <SettingRow
                      key={setting.id}
                      setting={setting}
                      isEditing={editingId === setting.id}
                      onEdit={() => setEditingId(setting.id)}
                      onCancel={() => setEditingId(null)}
                      onSave={handleUpdateSetting}
                      onDelete={handleDeleteSetting}
                      saving={saving}
                    />
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Settings Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{settings.length}</div>
              <div className="text-sm text-muted-foreground">Total Settings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{categories.length}</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {settings.filter(s => s.category === 'company').length}
              </div>
              <div className="text-sm text-muted-foreground">Company Settings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {settings.filter(s => s.category === 'system').length}
              </div>
              <div className="text-sm text-muted-foreground">System Settings</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Setting Row Component
interface SettingRowProps {
  setting: Setting;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (setting: Setting, newValue: string) => void;
  onDelete: (key: string) => void;
  saving: boolean;
}

function SettingRow({ setting, isEditing, onEdit, onCancel, onSave, onDelete, saving }: SettingRowProps) {
  const [editValue, setEditValue] = useState(String(setting.value));

  // Format value for display
  const formatValue = (value: any): string => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    return String(value);
  };

  // Reset edit value when editing starts
  const handleEdit = () => {
    setEditValue(formatValue(setting.value));
    onEdit();
  };

  const handleSave = () => {
    onSave(setting, editValue);
  };

  return (
    <TableRow>
      <TableCell className="font-mono text-sm">{setting.key}</TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="max-w-xs"
            disabled={saving}
          />
        ) : (
          <span className="break-all">{formatValue(setting.value)}</span>
        )}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {setting.description || 'No description'}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {new Date(setting.updatedAt).toLocaleDateString()}
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-1">
          {isEditing ? (
            <>
              <Button size="sm" variant="ghost" onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
              </Button>
              <Button size="sm" variant="ghost" onClick={onCancel} disabled={saving}>
                <X className="w-3 h-3" />
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" variant="ghost" onClick={handleEdit}>
                <Edit className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(setting.key)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}