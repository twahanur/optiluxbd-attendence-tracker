"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Loader2, Save, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import {
  updateUserProfile,
  changePassword,
  type UserProfile,
  type UpdateProfileRequest,
  type ChangePasswordRequest,
} from "@/service/profile";

interface ProfileClientProps {
  initialProfile: UserProfile | null;
  error?: string;
}

export default function ProfileClient({ initialProfile, error: initialError }: ProfileClientProps) {
  // Profile state
  const [profile, setProfile] = useState<UserProfile | null>(initialProfile);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [formData, setFormData] = useState<UpdateProfileRequest>({
    name: initialProfile?.name || "",
    firstName: initialProfile?.firstName || "",
    lastName: initialProfile?.lastName || "",
    phoneNumber: initialProfile?.phoneNumber || "",
    address: initialProfile?.address || "",
  });

  const [passwordData, setPasswordData] = useState<ChangePasswordRequest>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Show initial error if any
  useEffect(() => {
    if (initialError) {
      toast.error(initialError);
    } else if (initialProfile) {
      toast.success("Profile loaded successfully");
    }
  }, [initialError, initialProfile]);

  // Handle profile form changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle password form changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    if (!profile) {
      toast.error("Profile data not loaded");
      return;
    }

    setLoading(true);
    try {
      const response = await updateUserProfile(formData);

      if (response.success && response.data) {
        setProfile(response.data.profile);
        setEditMode(false);
        toast.success("Profile updated successfully");
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const handleChangePassword = async () => {
    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("All password fields are required");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      toast.error("New password must be different from current password");
      return;
    }

    setLoading(true);
    try {
      const response = await changePassword(passwordData);

      if (response.success) {
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        toast.success("Password changed successfully. Please log in again.");
        // Optionally redirect to login after a delay
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        toast.error(response.message || "Failed to change password");
      }
    } catch (err) {
      console.error("Error changing password:", err);
      toast.error(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    if (profile) {
      setFormData({
        name: profile.name,
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        phoneNumber: profile.phoneNumber || "",
        address: profile.address || "",
      });
      setEditMode(false);
    }
  };

  if (loading && !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-400" />
          <p className="text-white">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto p-6">
        <Alert className="border-red-500/50 bg-red-500/10">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-200">
            Failed to load profile. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">My Profile</h1>
        <p className="text-gray-200 mt-2">Manage your account information and settings</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="edit">Edit Profile</TabsTrigger>
          <TabsTrigger value="password">Change Password</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card className="border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-400 text-sm">Full Name</Label>
                  <p className="text-white text-lg font-medium">{profile.name || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Email</Label>
                  <p className="text-white">{profile.email}</p>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Phone Number</Label>
                  <p className="text-white">{profile.phoneNumber || "Not provided"}</p>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Address</Label>
                  <p className="text-white text-sm">{profile.address || "Not provided"}</p>
                </div>
              </CardContent>
            </Card>

            {/* Work Information */}
            <Card className="border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Work Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-400 text-sm">Employee ID</Label>
                  <p className="text-white font-medium">{profile.employeeId || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Department</Label>
                  <p className="text-white">{profile.department || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Section</Label>
                  <p className="text-white">{profile.section || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Designation</Label>
                  <p className="text-white">{profile.designation || "N/A"}</p>
                </div>
              </CardContent>
            </Card>

            {/* Account Status */}
            <Card className="border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-400 text-sm">Status</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`h-2 w-2 rounded-full ${profile.isActive ? "bg-green-400" : "bg-red-400"}`} />
                    <p className="text-white">{profile.isActive ? "Active" : "Inactive"}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Role</Label>
                  <p className="text-white font-medium">{profile.role}</p>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Last Login</Label>
                  <p className="text-white text-sm">
                    {profile.lastLogin ? new Date(profile.lastLogin).toLocaleString() : "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Account Dates */}
            <Card className="border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Account Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-400 text-sm">Join Date</Label>
                  <p className="text-white">
                    {profile.joinDate ? new Date(profile.joinDate).toLocaleDateString() : "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Account Created</Label>
                  <p className="text-white text-sm">
                    {profile.createdAt ? new Date(profile.createdAt).toLocaleString() : "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Last Updated</Label>
                  <p className="text-white text-sm">
                    {profile.updatedAt ? new Date(profile.updatedAt).toLocaleString() : "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Edit Profile Tab */}
        <TabsContent value="edit" className="space-y-6">
          <Card className="border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Edit Profile Information</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleProfileChange}
                    disabled={!editMode}
                    placeholder="Enter first name"
                    className="border-white/20 bg-gray-900 text-white"
                  />
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-white">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleProfileChange}
                    disabled={!editMode}
                    placeholder="Enter last name"
                    className="border-white/20 bg-gray-900 text-white"
                  />
                </div>

                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleProfileChange}
                    disabled={!editMode}
                    placeholder="Enter full name"
                    className="border-white/20 bg-gray-900 text-white"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-white">
                    Phone Number
                  </Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleProfileChange}
                    disabled={!editMode}
                    placeholder="+1 (555) 000-0000"
                    className="border-white/20 bg-gray-900 text-white"
                  />
                </div>

                {/* Email (Read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled
                    className="border-white/20 bg-gray-800 text-gray-400"
                  />
                  <p className="text-xs text-gray-400">Email cannot be changed</p>
                </div>

                {/* Address */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address" className="text-white">
                    Address
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleProfileChange}
                    disabled={!editMode}
                    placeholder="Enter your address"
                    className="border-white/20 bg-gray-900 text-white"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                {!editMode ? (
                  <Button
                    onClick={() => setEditMode(true)}
                    className="bg-purple-500 hover:bg-purple-600"
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      disabled={loading}
                      variant="outline"
                      className="border-white/20"
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Change Password Tab */}
        <TabsContent value="password" className="space-y-6">
          <Card className="border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Password */}
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-white">
                  Current Password
                </Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                    className="border-white/20 bg-gray-900 text-white pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords((prev) => ({ ...prev, current: !prev.current }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-white">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                    className="border-white/20 bg-gray-900 text-white pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords((prev) => ({ ...prev, new: !prev.new }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-400">Minimum 6 characters required</p>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                    className="border-white/20 bg-gray-900 text-white pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <Alert className="border-blue-500/50 bg-blue-500/10">
                <AlertCircle className="h-4 w-4 text-blue-400" />
                <AlertDescription className="text-blue-200 text-sm">
                  <strong>Password Requirements:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Minimum 6 characters</li>
                    <li>Different from current password</li>
                    <li>Passwords must match</li>
                  </ul>
                </AlertDescription>
              </Alert>

              {/* Action Button */}
              <Button
                onClick={handleChangePassword}
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Changing Password...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Change Password
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
