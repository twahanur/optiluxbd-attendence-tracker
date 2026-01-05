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
  const [editingId, setEditingId] = useState<number | null>(null);
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
      const response = await settingsApi.getAll();
      console.log('[GeneralSettings] Settings response:', response);
      
      if(response.success && response.data) {
        console.log('[GeneralSettings] Setting settings data:', response.data);
        setSettings(response.data);
        
        // Extract unique categories from settings
        const uniqueCategories = Array.from(new Set(response.data.map(s => s.category)));
        setCategories(uniqueCategories);
      }
    } catch (error) {
      toast.error('Failed to load settings');
      console.error(error);
    } finally {
      setLoading(false);
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
  const [editValue, setEditValue] = useState(setting.value);

  // Reset edit value when editing starts
  const handleEdit = () => {
    setEditValue(setting.value);
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
          <span className="break-all">{setting.value}</span>
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