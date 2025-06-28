import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import {
  FormGroup,
  FormField,
  Input,
  Button,
  FormActions,
  FormSection,
} from '../../components/Form';

const Settings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*');

      if (error) throw error;
      
      // Convert array of settings to object
      const settingsObj = data.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {});
      
      setSettings(settingsObj);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (section, values) => {
    try {
      const updates = Object.entries(values).map(([key, value]) => ({
        key: `${section}.${key}`,
        value
      }));

      const { error } = await supabase
        .from('settings')
        .upsert(updates);

      if (error) throw error;
      
      await fetchSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>

      <div className="bg-white shadow rounded-lg">
        <div className="p-6 space-y-6">
          <FormSection
            title="General Settings"
            description="Basic website configuration"
          >
            <FormGroup>
              <FormField label="Website Name">
                <Input
                  type="text"
                  defaultValue={settings['general.siteName']}
                />
              </FormField>
              <FormField label="Contact Email">
                <Input
                  type="email"
                  defaultValue={settings['general.contactEmail']}
                />
              </FormField>
            </FormGroup>
            <FormActions>
              <Button variant="primary">Save Changes</Button>
            </FormActions>
          </FormSection>

          <FormSection
            title="Social Media"
            description="Social media profile links"
          >
            <FormGroup>
              <FormField label="Facebook URL">
                <Input
                  type="url"
                  defaultValue={settings['social.facebook']}
                />
              </FormField>
              <FormField label="Twitter URL">
                <Input
                  type="url"
                  defaultValue={settings['social.twitter']}
                />
              </FormField>
              <FormField label="LinkedIn URL">
                <Input
                  type="url"
                  defaultValue={settings['social.linkedin']}
                />
              </FormField>
            </FormGroup>
            <FormActions>
              <Button variant="primary">Save Changes</Button>
            </FormActions>
          </FormSection>
        </div>
      </div>
    </div>
  );
};

export default Settings; 