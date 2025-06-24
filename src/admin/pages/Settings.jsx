import React, { useState } from 'react'
import { 
  FiSettings,
  FiUser,
  FiMail,
  FiShield,
  FiGlobe,
  FiDatabase,
  FiBell,
  FiKey,
  FiSave,
  FiEdit2,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiX
} from 'react-icons/fi'
import AdminLayout from '../components/AdminLayout'

const Settings = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('general')
  const [showPassword, setShowPassword] = useState(false)
  const [settings, setSettings] = useState({
    general: {
      siteName: 'MA Education',
      siteDescription: 'Your trusted partner for international education',
      contactEmail: 'info@maeducation.com',
      contactPhone: '+60 3-1234-5678',
      address: '123 Education Street, Kuala Lumpur 50450, Malaysia',
      timezone: 'Asia/Kuala_Lumpur',
      language: 'en',
      currency: 'MYR'
    },
    profile: {
      name: 'Dr. Ahmad Rahman',
      email: 'ahmad.rahman@maeducation.com',
      role: 'Administrator',
      phone: '+60 3-1234-5678',
      avatar: null
    },
    security: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      twoFactorEnabled: false,
      sessionTimeout: 30,
      lastPasswordChange: '2024-12-15'
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      browserNotifications: true,
      weeklyReports: true,
      monthlyReports: true,
      systemAlerts: true,
      marketingEmails: false
    },
    api: {
      supabaseUrl: process.env.REACT_APP_SUPABASE_URL || '',
      supabaseKey: process.env.REACT_APP_SUPABASE_ANON_KEY || '',
      emailService: 'sendgrid',
      emailApiKey: '',
      smsService: 'twilio',
      smsApiKey: ''
    },
    backup: {
      autoBackup: true,
      backupFrequency: 'daily',
      retentionDays: 30,
      lastBackup: '2025-01-14T02:00:00Z'
    }
  })

  const tabs = [
    { id: 'general', label: 'General', icon: FiSettings },
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'security', label: 'Security', icon: FiShield },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'api', label: 'API & Integrations', icon: FiKey },
    { id: 'backup', label: 'Backup & Data', icon: FiDatabase }
  ]

  const handleSettingChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const handleSave = (section) => {
    // In a real app, this would save to the backend
    console.log('Saving settings for section:', section, settings[section])
    // Show success message
    alert('Settings saved successfully!')
  }

  const SettingCard = ({ title, children, onSave, section }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <button
          onClick={() => onSave(section)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
        >
          <FiSave className="w-4 h-4 mr-2" />
          Save Changes
        </button>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )

  const InputField = ({ label, type = 'text', value, onChange, placeholder, required = false }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        required={required}
      />
    </div>
  )

  const SelectField = ({ label, value, onChange, options, required = false }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        required={required}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )

  const ToggleField = ({ label, description, checked, onChange }) => (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )

  const renderGeneral = () => (
    <SettingCard title="General Settings" onSave={handleSave} section="general">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Site Name"
          value={settings.general.siteName}
          onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
          required
        />
        <InputField
          label="Contact Email"
          type="email"
          value={settings.general.contactEmail}
          onChange={(e) => handleSettingChange('general', 'contactEmail', e.target.value)}
          required
        />
        <InputField
          label="Contact Phone"
          type="tel"
          value={settings.general.contactPhone}
          onChange={(e) => handleSettingChange('general', 'contactPhone', e.target.value)}
        />
        <SelectField
          label="Timezone"
          value={settings.general.timezone}
          onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
          options={[
            { value: 'Asia/Kuala_Lumpur', label: 'Asia/Kuala Lumpur' },
            { value: 'Asia/Singapore', label: 'Asia/Singapore' },
            { value: 'Asia/Jakarta', label: 'Asia/Jakarta' },
            { value: 'UTC', label: 'UTC' }
          ]}
        />
        <SelectField
          label="Language"
          value={settings.general.language}
          onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
          options={[
            { value: 'en', label: 'English' },
            { value: 'ms', label: 'Bahasa Malaysia' },
            { value: 'zh', label: 'Chinese' },
            { value: 'ta', label: 'Tamil' }
          ]}
        />
        <SelectField
          label="Currency"
          value={settings.general.currency}
          onChange={(e) => handleSettingChange('general', 'currency', e.target.value)}
          options={[
            { value: 'MYR', label: 'Malaysian Ringgit (MYR)' },
            { value: 'USD', label: 'US Dollar (USD)' },
            { value: 'SGD', label: 'Singapore Dollar (SGD)' }
          ]}
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
        <textarea
          value={settings.general.siteDescription}
          onChange={(e) => handleSettingChange('general', 'siteDescription', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows="3"
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
        <textarea
          value={settings.general.address}
          onChange={(e) => handleSettingChange('general', 'address', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows="2"
        />
      </div>
    </SettingCard>
  )

  const renderProfile = () => (
    <SettingCard title="Profile Settings" onSave={handleSave} section="profile">
      <div className="flex items-center space-x-6 mb-6">
        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
          <FiUser className="w-8 h-8 text-gray-600" />
        </div>
        <div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
            Change Avatar
          </button>
          <p className="text-sm text-gray-500 mt-1">JPG, PNG or GIF. Max size 2MB.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Full Name"
          value={settings.profile.name}
          onChange={(e) => handleSettingChange('profile', 'name', e.target.value)}
          required
        />
        <InputField
          label="Email Address"
          type="email"
          value={settings.profile.email}
          onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
          required
        />
        <InputField
          label="Phone Number"
          type="tel"
          value={settings.profile.phone}
          onChange={(e) => handleSettingChange('profile', 'phone', e.target.value)}
        />
        <InputField
          label="Role"
          value={settings.profile.role}
          onChange={(e) => handleSettingChange('profile', 'role', e.target.value)}
          required
        />
      </div>
    </SettingCard>
  )

  const renderSecurity = () => (
    <SettingCard title="Security Settings" onSave={handleSave} section="security">
      <div className="space-y-6">
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">Change Password</h4>
          <div className="grid grid-cols-1 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={settings.security.currentPassword}
                onChange={(e) => handleSettingChange('security', 'currentPassword', e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </div>
            <InputField
              label="New Password"
              type="password"
              value={settings.security.newPassword}
              onChange={(e) => handleSettingChange('security', 'newPassword', e.target.value)}
            />
            <InputField
              label="Confirm New Password"
              type="password"
              value={settings.security.confirmPassword}
              onChange={(e) => handleSettingChange('security', 'confirmPassword', e.target.value)}
            />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">Security Options</h4>
          <div className="space-y-4">
            <ToggleField
              label="Two-Factor Authentication"
              description="Add an extra layer of security to your account"
              checked={settings.security.twoFactorEnabled}
              onChange={(value) => handleSettingChange('security', 'twoFactorEnabled', value)}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
              <select
                value={settings.security.sessionTimeout}
                onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
                <option value={0}>Never</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </SettingCard>
  )

  const renderNotifications = () => (
    <SettingCard title="Notification Settings" onSave={handleSave} section="notifications">
      <div className="space-y-6">
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">Communication Preferences</h4>
          <div className="space-y-4">
            <ToggleField
              label="Email Notifications"
              description="Receive notifications via email"
              checked={settings.notifications.emailNotifications}
              onChange={(value) => handleSettingChange('notifications', 'emailNotifications', value)}
            />
            <ToggleField
              label="SMS Notifications"
              description="Receive notifications via SMS"
              checked={settings.notifications.smsNotifications}
              onChange={(value) => handleSettingChange('notifications', 'smsNotifications', value)}
            />
            <ToggleField
              label="Browser Notifications"
              description="Show notifications in your browser"
              checked={settings.notifications.browserNotifications}
              onChange={(value) => handleSettingChange('notifications', 'browserNotifications', value)}
            />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">Report Preferences</h4>
          <div className="space-y-4">
            <ToggleField
              label="Weekly Reports"
              description="Receive weekly performance reports"
              checked={settings.notifications.weeklyReports}
              onChange={(value) => handleSettingChange('notifications', 'weeklyReports', value)}
            />
            <ToggleField
              label="Monthly Reports"
              description="Receive monthly business reports"
              checked={settings.notifications.monthlyReports}
              onChange={(value) => handleSettingChange('notifications', 'monthlyReports', value)}
            />
            <ToggleField
              label="System Alerts"
              description="Get notified about system issues"
              checked={settings.notifications.systemAlerts}
              onChange={(value) => handleSettingChange('notifications', 'systemAlerts', value)}
            />
            <ToggleField
              label="Marketing Emails"
              description="Receive marketing and promotional emails"
              checked={settings.notifications.marketingEmails}
              onChange={(value) => handleSettingChange('notifications', 'marketingEmails', value)}
            />
          </div>
        </div>
      </div>
    </SettingCard>
  )

  const renderAPI = () => (
    <SettingCard title="API & Integrations" onSave={handleSave} section="api">
      <div className="space-y-6">
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">Database Configuration</h4>
          <div className="space-y-4">
            <InputField
              label="Supabase URL"
              value={settings.api.supabaseUrl}
              onChange={(e) => handleSettingChange('api', 'supabaseUrl', e.target.value)}
              placeholder="https://your-project.supabase.co"
            />
            <InputField
              label="Supabase Anon Key"
              type="password"
              value={settings.api.supabaseKey}
              onChange={(e) => handleSettingChange('api', 'supabaseKey', e.target.value)}
              placeholder="Your Supabase anonymous key"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">Email Service</h4>
          <div className="space-y-4">
            <SelectField
              label="Email Provider"
              value={settings.api.emailService}
              onChange={(e) => handleSettingChange('api', 'emailService', e.target.value)}
              options={[
                { value: 'sendgrid', label: 'SendGrid' },
                { value: 'mailgun', label: 'Mailgun' },
                { value: 'ses', label: 'Amazon SES' },
                { value: 'smtp', label: 'Custom SMTP' }
              ]}
            />
            <InputField
              label="Email API Key"
              type="password"
              value={settings.api.emailApiKey}
              onChange={(e) => handleSettingChange('api', 'emailApiKey', e.target.value)}
              placeholder="Your email service API key"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">SMS Service</h4>
          <div className="space-y-4">
            <SelectField
              label="SMS Provider"
              value={settings.api.smsService}
              onChange={(e) => handleSettingChange('api', 'smsService', e.target.value)}
              options={[
                { value: 'twilio', label: 'Twilio' },
                { value: 'nexmo', label: 'Vonage (Nexmo)' },
                { value: 'aws-sns', label: 'Amazon SNS' }
              ]}
            />
            <InputField
              label="SMS API Key"
              type="password"
              value={settings.api.smsApiKey}
              onChange={(e) => handleSettingChange('api', 'smsApiKey', e.target.value)}
              placeholder="Your SMS service API key"
            />
          </div>
        </div>
      </div>
    </SettingCard>
  )

  const renderBackup = () => (
    <SettingCard title="Backup & Data Management" onSave={handleSave} section="backup">
      <div className="space-y-6">
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">Automatic Backup</h4>
          <div className="space-y-4">
            <ToggleField
              label="Enable Auto Backup"
              description="Automatically backup your data"
              checked={settings.backup.autoBackup}
              onChange={(value) => handleSettingChange('backup', 'autoBackup', value)}
            />
            <SelectField
              label="Backup Frequency"
              value={settings.backup.backupFrequency}
              onChange={(e) => handleSettingChange('backup', 'backupFrequency', e.target.value)}
              options={[
                { value: 'hourly', label: 'Every Hour' },
                { value: 'daily', label: 'Daily' },
                { value: 'weekly', label: 'Weekly' },
                { value: 'monthly', label: 'Monthly' }
              ]}
            />
            <SelectField
              label="Retention Period"
              value={settings.backup.retentionDays}
              onChange={(e) => handleSettingChange('backup', 'retentionDays', parseInt(e.target.value))}
              options={[
                { value: 7, label: '7 days' },
                { value: 30, label: '30 days' },
                { value: 90, label: '90 days' },
                { value: 365, label: '1 year' }
              ]}
            />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">Manual Actions</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h5 className="text-sm font-medium text-gray-900">Create Backup Now</h5>
                <p className="text-sm text-gray-500">Create an immediate backup of all data</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                Backup Now
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h5 className="text-sm font-medium text-gray-900">Restore from Backup</h5>
                <p className="text-sm text-gray-500">Restore data from a previous backup</p>
              </div>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
                Restore
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div>
                <h5 className="text-sm font-medium text-red-900">Export All Data</h5>
                <p className="text-sm text-red-600">Download a complete export of your data</p>
              </div>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
                Export Data
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-md font-medium text-gray-900 mb-2">Last Backup</h4>
          <p className="text-sm text-gray-600">
            {new Date(settings.backup.lastBackup).toLocaleString()}
          </p>
        </div>
      </div>
    </SettingCard>
  )

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'general': return renderGeneral()
      case 'profile': return renderProfile()
      case 'security': return renderSecurity()
      case 'notifications': return renderNotifications()
      case 'api': return renderAPI()
      case 'backup': return renderBackup()
      default: return renderGeneral()
    }
  }

  return (
    <AdminLayout onLogout={onLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">Manage your system preferences and configuration</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 space-y-1">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <tab.icon className="w-4 h-4 mr-3" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderActiveTab()}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default Settings
