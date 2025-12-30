# Profile Management API - Implementation Guide

## Overview

The Profile Management API provides comprehensive functionality for users to view and manage their personal information. This implementation includes server-side data fetching and a full-featured client interface.

## Implemented APIs

### 1. Get User Profile
**Endpoint:** `GET /users/profile`

**Service Function:** `getUserProfile()`

```typescript
import { getUserProfile } from "@/service/profile";

const response = await getUserProfile();
if (response.success) {
  const profile = response.data.profile;
}
```

**Response Structure:**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "profile": {
      "id": "cm123abc456def789",
      "email": "john.doe@company.com",
      "name": "John Doe",
      "firstName": "John",
      "lastName": "Doe",
      "role": "EMPLOYEE",
      "department": "IT",
      "section": "Development",
      "phoneNumber": "+1-555-123-4567",
      "address": "123 Main Street, City, State",
      "joinDate": "2024-01-15",
      "isActive": true,
      "lastLogin": "2025-12-30T10:30:00.000Z",
      "designation": "Software Engineer",
      "employeeId": "EMP001",
      "createdAt": "2025-12-23T12:00:00.000Z",
      "updatedAt": "2025-12-28T10:30:00.000Z"
    }
  }
}
```

### 2. Update User Profile
**Endpoint:** `PUT /users/profile`

**Service Function:** `updateUserProfile(data)`

```typescript
import { updateUserProfile } from "@/service/profile";

const response = await updateUserProfile({
  name: "John Updated Doe",
  firstName: "John",
  lastName: "Doe",
  phoneNumber: "+1-555-987-6543",
  address: "456 New Street, City"
});

if (response.success) {
  console.log("Profile updated:", response.data.updatedFields);
}
```

**Request Body:**
```json
{
  "name": "string (optional)",
  "firstName": "string (optional)",
  "lastName": "string (optional)",
  "phoneNumber": "string (optional)",
  "address": "string (optional)",
  "profilePicture": "string (optional)"
}
```

**Response Structure:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "profile": { /* updated profile object */ },
    "updatedFields": ["name", "phoneNumber", "address"]
  }
}
```

### 3. Change Password
**Endpoint:** `PUT /users/change-password`

**Service Function:** `changePassword(data)`

```typescript
import { changePassword } from "@/service/profile";

const response = await changePassword({
  currentPassword: "oldPassword123",
  newPassword: "newSecurePassword456!",
  confirmPassword: "newSecurePassword456!"
});

if (response.success) {
  console.log("Password changed successfully");
  // User will be redirected to login
}
```

**Request Body:**
```json
{
  "currentPassword": "string (required)",
  "newPassword": "string (required)",
  "confirmPassword": "string (required)"
}
```

**Response Structure:**
```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": {
    "passwordChangedAt": "2025-12-30T10:30:00.000Z",
    "forceLogout": true
  }
}
```

### 4. Get User Dashboard
**Endpoint:** `GET /users/dashboard`

**Service Function:** `getUserDashboard()`

```typescript
import { getUserDashboard } from "@/service/profile";

const response = await getUserDashboard();
if (response.success) {
  const dashboard = response.data;
}
```

---

## Component Implementation

### ProfileClient Component
Location: `component/profile/ProfileClient.tsx`

A comprehensive client component that handles all profile-related UI and interactions.

**Features:**
- ✅ View profile information in read-only mode
- ✅ Edit profile with validation
- ✅ Change password with strength validation
- ✅ Show/hide password toggle
- ✅ Loading states
- ✅ Error handling with toast notifications
- ✅ Form submission with async operations
- ✅ Confirmation before logout

**Props:**
```typescript
interface ProfileClientProps {
  initialProfile: UserProfile | null;
  error?: string;
}
```

**Tabs:**
1. **Overview** - Display profile information in read-only cards
2. **Edit Profile** - Edit personal information
3. **Change Password** - Secure password change with validation

### ProfilePage Component
Location: `app/(commonLayout)/profile/page.tsx`

Server component that handles authentication and data fetching.

**Responsibilities:**
- Fetches profile data server-side
- Handles authentication via cookies
- Passes data to client component
- Error handling

---

## Types & Interfaces

### UserProfile
```typescript
interface UserProfile {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  role: "ADMIN" | "EMPLOYEE";
  department?: string;
  section?: string;
  phoneNumber?: string;
  address?: string;
  joinDate?: string;
  isActive: boolean;
  lastLogin?: string;
  profilePicture?: string | null;
  designation?: string;
  employeeId?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

### UpdateProfileRequest
```typescript
interface UpdateProfileRequest {
  name?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  profilePicture?: string;
}
```

### ChangePasswordRequest
```typescript
interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
```

---

## Usage Examples

### Basic Usage
```typescript
import ProfileClient from "@/component/profile/ProfileClient";

// Use in a server component to fetch and pass data
export default async function MyProfilePage() {
  const profile = await fetchUserProfile();
  return <ProfileClient initialProfile={profile} />;
}
```

### Error Handling
```typescript
try {
  const response = await updateUserProfile({
    name: "New Name"
  });
  
  if (response.success) {
    toast.success("Profile updated");
  } else {
    toast.error(response.message);
  }
} catch (error) {
  console.error("Profile update failed:", error);
  toast.error("Failed to update profile");
}
```

### Password Validation
```typescript
const response = await changePassword({
  currentPassword: "old",
  newPassword: "newPassword123",
  confirmPassword: "newPassword123"
});

if (response.success) {
  // Force logout and redirect to login
  window.location.href = "/login";
}
```

---

## Validation Rules

### Profile Fields
- **Name:** 2-100 characters
- **First Name:** 2-50 characters
- **Last Name:** 2-50 characters
- **Phone Number:** Valid format (e.g., +1-555-123-4567)
- **Address:** Max 200 characters

### Password Requirements
- **Minimum Length:** 6 characters
- **Must be different** from current password
- **Confirmation:** Must match new password exactly
- **No spaces:** Password cannot contain only spaces

---

## Error Handling

### Common Errors

**401 - Unauthorized**
```json
{
  "success": false,
  "error": "Authentication required"
}
```
Solution: Redirect to login

**400 - Validation Error**
```json
{
  "success": false,
  "message": "Password too short",
  "details": {
    "field": "newPassword",
    "message": "Minimum 6 characters required"
  }
}
```
Solution: Show validation error to user

**409 - Conflict Error**
```json
{
  "success": false,
  "error": "Current password is incorrect"
}
```
Solution: Ask user to retry with correct password

---

## Integration Points

### Navigation
Add profile link to navigation:
```typescript
<Link href="/profile">My Profile</Link>
```

### Authentication Flow
After successful profile update:
```typescript
1. Update profile data
2. Show success toast
3. Update local state
4. Clear edit mode
```

After password change:
```typescript
1. Change password
2. Show success toast
3. Force logout (forceLogout: true)
4. Redirect to login page (1.5s delay)
```

---

## Security Considerations

✅ **Server-Side Auth:** Authentication handled server-side with cookies
✅ **Secure Cookies:** Auth token stored in HTTP-only cookies
✅ **Password Hashing:** Passwords hashed on backend
✅ **Token Validation:** All requests require valid token
✅ **Force Logout:** Password change forces re-authentication
✅ **No Password Storage:** Current password never stored or logged

---

## Testing Checklist

- [ ] View profile data
- [ ] Edit profile fields
- [ ] Save profile changes
- [ ] Cancel edit mode
- [ ] Change password with valid inputs
- [ ] Error handling for invalid password
- [ ] Error handling for mismatched passwords
- [ ] Show/hide password toggle works
- [ ] Loading states display correctly
- [ ] Toast notifications appear
- [ ] Redirect to login after password change
- [ ] Responsive design on mobile

---

## File Structure

```
service/
├── profile/
│   └── index.ts                 # Service functions

component/
├── profile/
│   └── ProfileClient.tsx        # Client component

app/
└── (commonLayout)/
    └── profile/
        └── page.tsx             # Server component
```

---

**Last Updated:** December 30, 2025  
**Status:** ✅ Production Ready
