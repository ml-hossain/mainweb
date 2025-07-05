import React, { useState, useEffect } from 'react'
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
  FiX,
  FiRefreshCw,
  FiDownload,
  FiUpload,
  FiAlertTriangle,
  FiCheckCircle,
  FiXCircle
} from 'react-icons/fi'
import AdminLayout from '../components/AdminLayout'
import { supabase } from '../../lib/supabase'

// Move component definitions outside to prevent recreation on every render
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

const Settings = ({ onLogout, user }) => {
  const [activeTab, setActiveTab] = useState('general')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [saving, setSaving] = useState({})
  const [lastSaved, setLastSaved] = useState({})
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')
  const [backupProgress, setBackupProgress] = useState(0)
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
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

  // Load settings from database on component mount
  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      )
      
      // Fetch all settings from the database
      const dataPromise = supabase
        .from('site_settings')
        .select('*')
        .eq('is_active', true)
      
      const { data, error } = await Promise.race([dataPromise, timeoutPromise])
      
      if (error) throw error
      
      console.log('Settings loaded successfully:', data?.length)
      
      // Convert settings array to object format based on actual table structure
      if (data && data.length > 0) {
        const updatedSettings = { ...settings }
        
        data.forEach(setting => {
          try {
            // Parse setting value (it should be JSON for section-based settings)
            let value = setting.setting_value
            if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
              value = JSON.parse(value)
            }
            
            // Map section-based settings
            if (setting.setting_key === 'general_settings' && typeof value === 'object') {
              updatedSettings.general = { ...updatedSettings.general, ...value }
              console.log('Loaded general settings:', value)
            } else if (setting.setting_key === 'profile_settings' && typeof value === 'object') {
              updatedSettings.profile = { ...updatedSettings.profile, ...value }
              console.log('Loaded profile settings:', value)
            } else if (setting.setting_key === 'security_settings' && typeof value === 'object') {
              updatedSettings.security = { ...updatedSettings.security, ...value }
              console.log('Loaded security settings:', value)
            } else if (setting.setting_key === 'notifications_settings' && typeof value === 'object') {
              updatedSettings.notifications = { ...updatedSettings.notifications, ...value }
              console.log('Loaded notifications settings:', value)
            } else if (setting.setting_key === 'api_settings' && typeof value === 'object') {
              updatedSettings.api = { ...updatedSettings.api, ...value }
              console.log('Loaded api settings:', value)
            } else if (setting.setting_key === 'backup_settings' && typeof value === 'object') {
              updatedSettings.backup = { ...updatedSettings.backup, ...value }
              console.log('Loaded backup settings:', value)
            } else {
              // Handle legacy individual settings for backward compatibility
              if (setting.setting_key.includes('site_') || setting.setting_key.includes('contact_') || setting.setting_key.includes('office_')) {
                if (setting.setting_key === 'site_title') updatedSettings.general.siteName = value
                else if (setting.setting_key === 'site_description') updatedSettings.general.siteDescription = value
                else if (setting.setting_key === 'contact_email') updatedSettings.general.contactEmail = value
                else if (setting.setting_key === 'contact_phone') updatedSettings.general.contactPhone = value
                else if (setting.setting_key === 'office_address') updatedSettings.general.address = value
                console.log('Loaded legacy setting:', setting.setting_key, value)
              }
            }
          } catch (parseError) {
            console.warn('Error parsing setting:', setting.setting_key, parseError)
          }
        })
        
        setSettings(updatedSettings)
        console.log('Final settings state:', updatedSettings)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      setErrors({ general: 'Failed to load settings' })
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    try {
      setRefreshing(true)
      console.log('Refreshing settings data...')
      
      // Add timeout to prevent hanging requests
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      )
      
      const refreshPromise = fetchSettings()
      
      await Promise.race([refreshPromise, timeoutPromise])
      
      console.log('Settings data refreshed successfully')
      setSuccessMessage('Settings refreshed successfully')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Error refreshing settings:', error)
      setErrors(prev => ({ ...prev, refresh: `Failed to refresh settings: ${error.message}` }))
      setTimeout(() => setErrors(prev => ({ ...prev, refresh: '' })), 5000)
    } finally {
      setRefreshing(false)
    }
  }

  const handleSettingChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
    
    // Clear any existing errors for this field
    setErrors(prev => ({
      ...prev,
      [`${section}.${field}`]: ''
    }))
  }

  const handleSave = async (section) => {
    try {
      setSaving(prev => ({ ...prev, [section]: true }))
      setErrors(prev => ({ ...prev, [section]: '' }))
      
      const sectionSettings = settings[section]
      
      // Save the entire section as a single JSON object with a key based on section name
      const settingKey = `${section}_settings`
      const settingData = {
        setting_key: settingKey,
        setting_value: JSON.stringify(sectionSettings),
        setting_type: 'json',
        description: `${section.charAt(0).toUpperCase() + section.slice(1)} configuration settings`,
        is_active: true,
        updated_at: new Date().toISOString()
      }
      
      // Try to update existing setting first
      const { data: existing } = await supabase
        .from('site_settings')
        .select('id')
        .eq('setting_key', settingKey)
        .single()
      
      if (existing) {
        // Update existing setting
        const { error } = await supabase
          .from('site_settings')
          .update(settingData)
          .eq('id', existing.id)
        
        if (error) throw error
        console.log(`Updated ${settingKey} settings`)
      } else {
        // Insert new setting
        const { error } = await supabase
          .from('site_settings')
          .insert([{ ...settingData, created_at: new Date().toISOString() }])
        
        if (error) throw error
        console.log(`Created new ${settingKey} settings`)
      }
      
      setLastSaved(prev => ({ ...prev, [section]: new Date().toISOString() }))
      setSuccessMessage(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully!`)
      setTimeout(() => setSuccessMessage(''), 3000)
      
    } catch (error) {
      console.error('Error saving settings:', error)
      setErrors(prev => ({ ...prev, [section]: `Failed to save settings: ${error.message}` }))
    } finally {
      setSaving(prev => ({ ...prev, [section]: false }))
    }
  }

  const handleBackup = async () => {
    try {
      setIsBackingUp(true)
      setBackupProgress(0)
      
      // Simulate backup progress
      const tables = ['universities', 'consultations', 'contact_requests', 'site_settings', 'page_seo_settings']
      let completed = 0
      
      const backupData = {}
      
      for (const table of tables) {
        setBackupProgress((completed / tables.length) * 100)
        
        const { data, error } = await supabase
          .from(table)
          .select('*')
        
        if (error) throw error
        
        backupData[table] = data
        completed++
        
        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 500))
      }
      
      setBackupProgress(100)
      
      // Create and download backup file
      const backupContent = JSON.stringify({
        timestamp: new Date().toISOString(),
        version: '1.0',
        data: backupData
      }, null, 2)
      
      const blob = new Blob([backupContent], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ma-education-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      // Update last backup time
      await handleSave('backup')
      handleSettingChange('backup', 'lastBackup', new Date().toISOString())
      
      setSuccessMessage('Backup created and downloaded successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
      
    } catch (error) {
      console.error('Backup error:', error)
      setErrors({ backup: 'Failed to create backup. Please try again.' })
    } finally {
      setIsBackingUp(false)
      setBackupProgress(0)
    }
  }

  const handleRestore = async () => {
    if (!window.confirm('This will replace all current data with backup data. Are you sure?')) {
      return
    }
    
    try {
      setIsRestoring(true)
      
      // Create file input for backup file selection
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.json'
      
      input.onchange = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        
        try {
          const text = await file.text()
          const backup = JSON.parse(text)
          
          if (!backup.data || !backup.timestamp) {
            throw new Error('Invalid backup file format')
          }
          
          // Restore each table
          for (const [tableName, tableData] of Object.entries(backup.data)) {
            if (tableData && tableData.length > 0) {
              // Clear existing data
              await supabase.from(tableName).delete().neq('id', 'never-match')
              
              // Insert backup data
              const { error } = await supabase
                .from(tableName)
                .insert(tableData)
              
              if (error) throw error
            }
          }
          
          setSuccessMessage('Data restored successfully from backup!')
          setTimeout(() => {
            setSuccessMessage('')
            window.location.reload() // Refresh to show restored data
          }, 2000)
          
        } catch (error) {
          console.error('Restore error:', error)
          setErrors({ backup: 'Failed to restore from backup. Please check the file format.' })
        } finally {
          setIsRestoring(false)
        }
      }
      
      input.click()
      
    } catch (error) {
      console.error('Restore error:', error)
      setErrors({ backup: 'Failed to initiate restore process.' })
      setIsRestoring(false)
    }
  }

  const handleExportData = async () => {
    try {
      // Reuse backup functionality for data export
      await handleBackup()
    } catch (error) {
      console.error('Export error:', error)
      setErrors({ backup: 'Failed to export data.' })
    }
  }

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
                {isBackingUp && backupProgress > 0 && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${backupProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{Math.round(backupProgress)}% complete</p>
                  </div>
                )}
              </div>
              <button 
                onClick={handleBackup}
                disabled={isBackingUp || isRestoring}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isBackingUp ? (
                  <>
                    <FiRefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <FiDownload className="w-4 h-4 mr-2" />
                    Backup Now
                  </>
                )}
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h5 className="text-sm font-medium text-gray-900">Restore from Backup</h5>
                <p className="text-sm text-gray-500">Restore data from a previous backup</p>
                {isRestoring && (
                  <p className="text-xs text-blue-600 mt-1">Processing restore...</p>
                )}
              </div>
              <button 
                onClick={handleRestore}
                disabled={isBackingUp || isRestoring}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isRestoring ? (
                  <>
                    <FiRefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Restoring...
                  </>
                ) : (
                  <>
                    <FiUpload className="w-4 h-4 mr-2" />
                    Restore
                  </>
                )}
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div>
                <h5 className="text-sm font-medium text-red-900">Export All Data</h5>
                <p className="text-sm text-red-600">Download a complete export of your data</p>
              </div>
              <button 
                onClick={handleExportData}
                disabled={isBackingUp || isRestoring}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <FiDownload className="w-4 h-4 mr-2" />
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

  if (loading) {
    return (
      <AdminLayout onLogout={onLogout} user={user}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout onLogout={onLogout} user={user}>
      <div className="space-y-6 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-7xl mx-auto">
        {/* Modern Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-slate-800 to-zinc-900 rounded-3xl shadow-2xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-white to-transparent rounded-full blur-3xl"></div>
            <div className="absolute top-20 right-10 w-24 h-24 bg-gradient-to-br from-gray-300 to-transparent rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 left-20 w-40 h-40 bg-gradient-to-br from-slate-300 to-transparent rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative p-6 md:p-10">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
              {/* Left Content */}
              <div className="flex-1 mb-8 lg:mb-0">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-slate-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                    <FiSettings className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                      Settings Manager
                    </h1>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-gray-200 text-sm font-medium">System Configuration</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-100 text-base md:text-lg font-medium mb-6 max-w-2xl">
                  Manage your system preferences, security settings, and backup configurations
                </p>
                
                {/* Stats Row */}
                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                    <FiSettings className="w-4 h-4 mr-2 text-gray-300" />
                    <span className="text-white font-semibold">{tabs.length}</span>
                    <span className="text-gray-200 ml-1">Setting Categories</span>
                  </div>
                  <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                    <span className="text-white font-semibold">{lastSaved[activeTab] ? 'Saved' : 'Unsaved'}</span>
                    <span className="text-gray-200 ml-1">Current Tab</span>
                  </div>
                  <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                    <FiDatabase className="w-4 h-4 mr-2 text-gray-300" />
                    <span className="text-white font-semibold">Live</span>
                    <span className="text-gray-200 ml-1">Database</span>
                  </div>
                </div>
              </div>
              
              {/* Right Actions */}
              <div className="flex flex-col sm:flex-row gap-4 lg:flex-col lg:gap-3">
                <button 
                  onClick={refreshData}
                  disabled={refreshing}
                  className="group flex items-center justify-center px-6 py-3 bg-white/15 backdrop-blur-sm border border-white/25 rounded-xl hover:bg-white/25 transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    <FiRefreshCw className={`w-4 h-4 text-white ${refreshing ? 'animate-spin' : ''}`} />
                  </div>
                  <div className="text-left">
                    <div className="text-white font-semibold text-sm">{refreshing ? 'Refreshing...' : 'Refresh Data'}</div>
                    <div className="text-gray-200 text-xs">Update settings</div>
                  </div>
                </button>
                
                <button
                  onClick={() => handleSave(activeTab)}
                  disabled={saving[activeTab]}
                  className="group flex items-center justify-center px-6 py-3 bg-gradient-to-br from-white to-gray-50 text-gray-900 rounded-xl hover:from-gray-50 hover:to-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-slate-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    {saving[activeTab] ? (
                      <FiRefreshCw className="w-4 h-4 text-white animate-spin" />
                    ) : (
                      <FiSave className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm">{saving[activeTab] ? 'Saving...' : 'Save Settings'}</div>
                    <div className="text-gray-600 text-xs">Current tab</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <FiCheckCircle className="w-5 h-5 text-green-500 mr-3" />
              <span className="text-green-800 font-medium">{successMessage}</span>
            </div>
          </div>
        )}
        
        {Object.entries(errors).map(([key, error]) => error && (
          <div key={key} className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <FiXCircle className="w-5 h-5 text-red-500 mr-3" />
              <span className="text-red-800 font-medium">{error}</span>
            </div>
          </div>
        ))}

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
