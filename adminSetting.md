SettingsService (Phase 1 - Foundation)
File: src/modules/admin/services/SettingsService.ts
Class: SettingsService
Purpose: Core admin settings management infrastructure
Responsibilities:
CRUD operations for all system settings
Category-based settings organization
Bulk settings updates
Settings validation and type checking
Configuration backup and restore
Key Methods:
getAllSettings() - Retrieve all system settings
getSettingsByCategory() - Category-filtered settings
getSetting() - Individual setting retrieval
createSetting() - New setting creation
updateSetting() - Setting modification
deleteSetting() - Setting removal
bulkUpdate() - Multiple settings update
Features:
JSON-based flexible configuration storage
Type-safe settings management
Category organization (company, email, user, etc.)
Audit trail for settings changes
6. CompanySettingsService (Phase 2 - Company Configuration)
File: src/modules/admin/services/CompanySettingsService.ts
Class: CompanySettingsService
Purpose: Company profile and operational settings management
Responsibilities:
Company profile management (name, address, contact info)
Working hours configuration for all days
Holiday management and calendar
Working day validation logic
Timezone and scheduling settings
Key Methods:
getCompanyProfile() - Company information retrieval
updateCompanyProfile() - Company data management
getWorkingHours() - Working schedule retrieval
updateWorkingHours() - Schedule configuration
getHolidays() - Holiday calendar management
addHoliday() - New holiday addition
updateHoliday() - Holiday modification
deleteHoliday() - Holiday removal
isWorkingDay() - Working day validation
getAllCompanySettings() - Complete company config
Features:
Flexible working hours per day
Public/private holiday categorization
Timezone-aware scheduling
Integration with attendance validation
Lunch break configuration
7. EmailSettingsService (Phase 3 - Email Configuration)
File: src/modules/admin/services/EmailSettingsService.ts
Class: EmailSettingsService
Purpose: Email system configuration and template management
Responsibilities:
SMTP server configuration
Email template management (subject, HTML, text)
Notification scheduling and cron job management
Email system testing and validation
Template hot-reloading capabilities
Key Methods:
getSMTPConfig() - SMTP configuration retrieval
updateSMTPConfig() - SMTP server setup
testSMTPConnection() - Connection validation
getAllTemplates() - Email templates management
getTemplate() - Individual template retrieval
updateTemplate() - Template modification
deleteTemplate() - Template removal
getScheduleSettings() - Notification schedule config
updateScheduleSettings() - Cron job configuration
reloadSchedule() - Hot reload notification jobs
Features:
Multiple email template support
Variable substitution in templates
SMTP connection testing
Cron-based notification scheduling
Email system health monitoring
8. UserSettingsService (Phase 4 - User Management)
File: src/modules/admin/services/UserSettingsService.ts
Class: UserSettingsService
Purpose: User management policies and security settings
Responsibilities:
Password policy enforcement
Registration control and validation
Account lockout rules management
User profile field configuration
Session management settings
Key Methods:
getPasswordPolicy() - Password rules retrieval
updatePasswordPolicy() - Password policy configuration
validatePassword() - Password compliance checking
getPasswordRequirements() - Policy description
getRegistrationPolicy() - Registration rules
updateRegistrationPolicy() - Registration control
validateRegistrationEmail() - Email domain validation
checkRegistrationAllowed() - Registration permission check
getLockoutRules() - Account lockout configuration
updateLockoutRules() - Lockout policy management
getProfileFields() - User profile configuration
updateProfileFields() - Profile field management
addProfileField() - New field addition
removeProfileField() - Field removal
getSessionSettings() - Session configuration
updateSessionSettings() - Session policy management
getAllUserSettings() - Complete user policy config
resetUserSettings() - Default settings restoration
Features:
Comprehensive password policy (length, complexity, history)
Domain-based registration control
Progressive account lockout protection
Dynamic profile field configuration
Session timeout and security settings

Communication Services
9. EmailService (Enhanced)
File: src/shared/services/emailService.ts
Class: EmailService
Purpose: Main email communication system with admin configuration
Responsibilities:
Attendance reminder notifications
Daily absentee reports to admins
Weekly performance reports
System notifications
NEW: Admin-configurable email templates
NEW: Dynamic SMTP configuration from admin settings
Key Methods:
sendAttendanceReminder() - Daily reminders with custom templates
sendDailyAbsenteeReport() - Admin notifications
sendWeeklyReport() - Performance summaries
sendSystemNotification() - General alerts
NEW: createTransport() - Dynamic SMTP setup from settings
NEW: loadTemplate() - Admin-configured template loading
Features:
Admin-controlled HTML email templates
Database-driven SMTP configuration
Template variable substitution
Email queue management
10. PasswordResetEmailService (Enhanced)
File: src/shared/utils/passwordResetEmailService.ts
Class: EmailService
Purpose: Specialized password reset email handling with admin templates
Responsibilities:
Password reset email templates (admin-configurable)
Secure token delivery
Reset confirmation emails
Email security measures
Key Methods:
sendPasswordResetEmail() - Reset initiation with admin templates
sendPasswordResetConfirmation() - Reset confirmation
sendPasswordChangeNotification() - Security notification



Phase 1 - Foundation Settings Management
GET /settings
Retrieve all system settings (Admin only).
Success Response (200):
{
  "success": true,
  "message": "Settings retrieved successfully",
  "data": {
    "settings": [
      {
        "id": 1,
        "key": "company.name",
        "value": "Acme Corporation",
        "category": "company",
        "description": "Company name for branding",
        "createdAt": "2025-12-28T09:00:00.000Z",
        "updatedAt": "2025-12-28T10:00:00.000Z"
      }
    ],
    "total": 15,
    "categories": ["company", "email", "user", "system"]
  },
  "timestamp": "2025-12-28T10:30:00.000Z"
}

GET /settings/category/:category
Get settings by category.
Success Response (200):
{
  "success": true,
  "message": "Category settings retrieved",
  "data": {
    "category": "company",
    "settings": [
      {
        "key": "company.name",
        "value": "Acme Corporation",
        "description": "Company name"
      }
    ],
    "count": 5
  },
  "timestamp": "2025-12-28T10:30:00.000Z"
}

POST /settings
Create new setting.
Request Body:
{
  "key": "company.logo",
  "value": "https://company.com/logo.png",
  "category": "company",
  "description": "Company logo URL"
}

Success Response (201):
{
  "success": true,
  "message": "Setting created successfully",
  "data": {
    "setting": {
      "id": 16,
      "key": "company.logo",
      "value": "https://company.com/logo.png",
      "category": "company",
      "description": "Company logo URL"
    }
  },
  "timestamp": "2025-12-28T10:30:00.000Z"
}

PUT /settings/bulk
Bulk update multiple settings.
Request Body:
{
  "settings": [
    {
      "key": "company.name",
      "value": "Updated Company Name",
      "category": "company"
    },
    {
      "key": "company.email",
      "value": "contact@updated.com",
      "category": "company"
    }
  ]
}

Phase 2 - Company Settings Management
GET /settings/company/profile
Get company profile information.
Success Response (200):
{
  "success": true,
  "message": "Company profile retrieved",
  "data": {
    "profile": {
      "name": "Acme Corporation",
      "address": "123 Main Street, City, State 12345",
      "phone": "+1-555-123-4567",
      "email": "info@acme.com",
      "website": "https://www.acme.com",
      "industry": "Technology",
      "description": "Leading technology company",
      "logo": "https://logo.acme.com/logo.png"
    }
  },
  "timestamp": "2025-12-28T10:30:00.000Z"
}

PUT /settings/company/profile
Update company profile.
Request Body:
{
  "name": "Updated Company Name",
  "address": "456 New Street, New City, State 54321",
  "phone": "+1-555-987-6543",
  "email": "contact@updated.com",
  "website": "https://www.updated.com",
  "industry": "Technology Solutions",
  "description": "Advanced technology solutions provider"
}

GET /settings/company/working-hours
Get working hours configuration.
Success Response (200):
{
  "success": true,
  "message": "Working hours retrieved",
  "data": {
    "workingHours": {
      "monday": { "start": "09:00", "end": "17:00", "isWorkingDay": true },
      "tuesday": { "start": "09:00", "end": "17:00", "isWorkingDay": true },
      "wednesday": { "start": "09:00", "end": "17:00", "isWorkingDay": true },
      "thursday": { "start": "09:00", "end": "17:00", "isWorkingDay": true },
      "friday": { "start": "09:00", "end": "17:00", "isWorkingDay": true },
      "saturday": { "start": "09:00", "end": "13:00", "isWorkingDay": false },
      "sunday": { "start": "00:00", "end": "00:00", "isWorkingDay": false },
      "timezone": "Asia/Dhaka",
      "lunchBreakStart": "12:00",
      "lunchBreakEnd": "13:00"
    }
  },
  "timestamp": "2025-12-28T10:30:00.000Z"
}

GET /settings/company/holidays
Get holiday calendar.
Success Response (200):
{
  "success": true,
  "message": "Holidays retrieved",
  "data": {
    "holidays": [
      {
        "name": "New Year",
        "date": "2025-01-01",
        "type": "public",
        "description": "New Year celebration"
      },
      {
        "name": "Independence Day",
        "date": "2025-03-26",
        "type": "public",
        "description": "National Independence Day"
      }
    ],
    "total": 15,
    "year": 2025
  },
  "timestamp": "2025-12-28T10:30:00.000Z"
}

POST /settings/company/holidays
Add new holiday.
Request Body:
{
  "name": "Company Foundation Day",
  "date": "2025-05-15",
  "type": "private",
  "description": "Company anniversary celebration"
}

GET /settings/company/working-day/:date
Check if specific date is a working day.
Success Response (200):
{
  "success": true,
  "message": "Working day status retrieved",
  "data": {
    "date": "2025-12-28",
    "isWorkingDay": true,
    "dayOfWeek": "Saturday",
    "isHoliday": false,
    "holidayInfo": null,
    "workingHours": {
      "start": "09:00",
      "end": "13:00"
    }
  },
  "timestamp": "2025-12-28T10:30:00.000Z"
}

Phase 3 - Email Settings Management
GET /settings/email/smtp
Get SMTP configuration (passwords hidden).
Success Response (200):
{
  "success": true,
  "message": "SMTP configuration retrieved",
  "data": {
    "smtp": {
      "host": "smtp.gmail.com",
      "port": 587,
      "secure": false,
      "user": "system@company.com",
      "pass": "***hidden***",
      "from": "Attendance System <noreply@company.com>",
      "isConfigured": true
    }
  },
  "timestamp": "2025-12-28T10:30:00.000Z"
}

PUT /settings/email/smtp
Update SMTP configuration.
Request Body:
{
  "host": "smtp.gmail.com",
  "port": 587,
  "secure": false,
  "user": "system@company.com",
  "pass": "app-password-here",
  "from": "Attendance System <noreply@company.com>"
}

POST /settings/email/smtp/test
Test SMTP connection.
Success Response (200):
{
  "success": true,
  "message": "SMTP connection test successful",
  "data": {
    "connectionStatus": "success",
    "testTime": "2025-12-28T10:30:00.000Z",
    "serverResponse": "220 smtp.gmail.com ESMTP ready"
  },
  "timestamp": "2025-12-28T10:30:00.000Z"
}

GET /settings/email/templates
Get all email templates.
Success Response (200):
{
  "success": true,
  "message": "Email templates retrieved",
  "data": {
    "templates": {
      "attendanceReminder": {
        "subject": "🕐 Attendance Reminder - Please Mark Your Attendance",
        "html": "<div>HTML template with {{variables}}</div>",
        "text": "Text version with {{variables}}",
        "variables": ["employeeName", "date", "companyName"]
      },
      "passwordReset": {
        "subject": "Password Reset Request",
        "html": "<div>Reset password template</div>",
        "text": "Reset password text",
        "variables": ["userName", "resetLink", "expiryTime"]
      }
    },
    "count": 5
  },
  "timestamp": "2025-12-28T10:30:00.000Z"
}

PUT /settings/email/templates/:templateName
Update specific email template.
Request Body:
{
  "subject": "📧 Updated Attendance Reminder",
  "html": "<div style='font-family: Arial;'><h2>Reminder</h2><p>Dear {{employeeName}},</p><p>Please mark attendance for {{date}}.</p></div>",
  "text": "Dear {{employeeName}}, Please mark attendance for {{date}}."
}

Phase 4 - User Management Settings
GET /admin/user-settings/password-policy
Get password policy configuration.
Success Response (200):
{
  "success": true,
  "message": "Password policy retrieved",
  "data": {
    "passwordPolicy": {
      "minLength": 8,
      "maxLength": 128,
      "requireUppercase": true,
      "requireLowercase": true,
      "requireNumbers": true,
      "requireSymbols": true,
      "preventCommonPasswords": true,
      "preventUserInfo": true,
      "expirationDays": 90,
      "historyCount": 5
    }
  },
  "timestamp": "2025-12-28T10:30:00.000Z"
}

PUT /admin/user-settings/password-policy
Update password policy.
Request Body:
{
  "minLength": 10,
  "maxLength": 128,
  "requireUppercase": true,
  "requireLowercase": true,
  "requireNumbers": true,
  "requireSymbols": false,
  "preventCommonPasswords": true,
  "preventUserInfo": true,
  "expirationDays": 120,
  "historyCount": 3
}

POST /admin/user-settings/password-policy/validate
Validate password against policy.
Request Body:
{
  "password": "TestPassword123!",
  "userInfo": {
    "email": "test@company.com",
    "name": "John Doe"
  }
}

Success Response (200):
{
  "success": true,
  "message": "Password validation completed",
  "data": {
    "isValid": true,
    "score": 95,
    "requirements": {
      "minLength": true,
      "maxLength": true,
      "hasUppercase": true,
      "hasLowercase": true,
      "hasNumbers": true,
      "hasSymbols": true,
      "notCommon": true,
      "notUserInfo": true
    },
    "suggestions": []
  },
  "timestamp": "2025-12-28T10:30:00.000Z"
}

GET /admin/user-settings/registration-policy
Get registration policy settings.
Success Response (200):
{
  "success": true,
  "message": "Registration policy retrieved",
  "data": {
    "registrationPolicy": {
      "allowSelfRegistration": false,
      "requireEmailVerification": true,
      "requireAdminApproval": true,
      "allowedEmailDomains": ["company.com", "subsidiary.com"],
      "blockedEmailDomains": ["tempmail.com", "guerrillamail.com"],
      "defaultRole": "EMPLOYEE",
      "autoActivateAccounts": false,
      "requireInvitation": true
    }
  },
  "timestamp": "2025-12-28T10:30:00.000Z"
}

GET /admin/user-settings/lockout-rules
Get account lockout configuration.
Success Response (200):
{
  "success": true,
  "message": "Lockout rules retrieved",
  "data": {
    "lockoutRules": {
      "enabled": true,
      "maxFailedAttempts": 5,
      "lockoutDurationMinutes": 30,
      "resetFailedAttemptsAfterMinutes": 60,
      "notifyAdminOnLockout": true,
      "allowSelfUnlock": false,
      "progressiveDelay": true
    }
  },
  "timestamp": "2025-12-28T10:30:00.000Z"
}

Admin User Management
POST /admin/employees
Create new employee account (Admin only).
Request Body:
{
  "email": "newemployee@company.com",
  "name": "New Employee",
  "department": "HR",
  "section": "Recruitment",
  "password": "tempPassword123!",
  "role": "EMPLOYEE"
}

Success Response (201):
{
  "success": true,
  "message": "Employee created successfully",
  "data": {
    "employee": {
      "id": 10,
      "email": "newemployee@company.com",
      "name": "New Employee",
      "role": "EMPLOYEE",
      "department": "HR",
      "section": "Recruitment",
      "isActive": true,
      "createdAt": "2025-12-28T10:30:00.000Z"
    },
    "temporaryPassword": "tempPassword123!",
    "resetRequired": true
  },
  "timestamp": "2025-12-28T10:30:00.000Z"
}

System Health & Testing
GET /admin/email-status
Get email system status.
Success Response (200):
{
  "success": true,
  "message": "Email system status retrieved",
  "data": {
    "emailSystem": {
      "isConfigured": true,
      "smtpStatus": "connected",
      "lastTestTime": "2025-12-28T09:00:00.000Z",
      "activeJobs": [
        {
          "name": "Daily Reminder",
          "schedule": "0 13 * * 1-5",
          "nextRun": "2025-12-29T13:00:00.000Z",
          "status": "active"
        }
      ],
      "emailsSentToday": 45,
      "failedEmailsToday": 2
    }
  },
  "timestamp": "2025-12-28T10:30:00.000Z"
}

POST /admin/test-email
Send test email.
Request Body:
{
  "email": "admin@company.com",
  "subject": "Test Email",
  "message": "This is a test email from the system."
}


