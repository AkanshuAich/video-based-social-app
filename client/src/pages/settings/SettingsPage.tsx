import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Bell, Video, Mic, Volume2, Shield, Eye, Moon, Wifi } from 'lucide-react';

type SettingType = 'switch' | 'slider';

interface Setting {
  id: string;
  label: string;
  icon?: React.ReactNode;
  type: SettingType;
  default: number | boolean;
}

interface SettingsGroup {
  title: string;
  settings: Setting[];
}

const SettingsPage = () => {
  const settingsGroups: SettingsGroup[] = [
    {
      title: 'Audio & Video',
      settings: [
        { id: 'autoJoinAudio', label: 'Auto-join room audio', icon: <Mic className="w-4 h-4" />, type: 'switch', default: true },
        { id: 'noiseReduction', label: 'Noise reduction', icon: <Volume2 className="w-4 h-4" />, type: 'switch', default: true },
        { id: 'videoQuality', label: 'Video quality', icon: <Video className="w-4 h-4" />, type: 'slider', default: 75 },
        { id: 'echoCancellation', label: 'Echo cancellation', icon: <Volume2 className="w-4 h-4" />, type: 'switch', default: true },
      ]
    },
    {
      title: 'Notifications',
      settings: [
        { id: 'roomInvites', label: 'Room invites', icon: <Bell className="w-4 h-4" />, type: 'switch', default: true },
        { id: 'friendRequests', label: 'Friend requests', icon: <Bell className="w-4 h-4" />, type: 'switch', default: true },
        { id: 'roomAlerts', label: 'Room alerts', icon: <Bell className="w-4 h-4" />, type: 'switch', default: true },
      ]
    },
    {
      title: 'Privacy & Security',
      settings: [
        { id: 'privateProfile', label: 'Private profile', icon: <Eye className="w-4 h-4" />, type: 'switch', default: false },
        { id: '2fa', label: 'Two-factor authentication', icon: <Shield className="w-4 h-4" />, type: 'switch', default: false },
        { id: 'dataUsage', label: 'Limit data usage', icon: <Wifi className="w-4 h-4" />, type: 'switch', default: false },
      ]
    },
    {
      title: 'Appearance',
      settings: [
        { id: 'darkMode', label: 'Dark mode', icon: <Moon className="w-4 h-4" />, type: 'switch', default: true },
        { id: 'animationReduction', label: 'Reduce animations', icon: <Eye className="w-4 h-4" />, type: 'switch', default: false },
        { id: 'fontSize', label: 'Font size', type: 'slider', default: 100 },
      ]
    },
  ];

  const handleSwitchChange = (settingId: string, checked: boolean) => {
    console.log(`Setting ${settingId} changed to ${checked}`);
    // TODO: Implement settings persistence
  };

  const handleSliderChange = (settingId: string, value: number[]) => {
    console.log(`Setting ${settingId} changed to ${value[0]}`);
    // TODO: Implement settings persistence
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      {settingsGroups.map((group) => (
        <Card key={group.title} className="p-6">
          <h2 className="text-xl font-semibold mb-4">{group.title}</h2>
          <div className="space-y-4">
            {group.settings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {setting.icon}
                  <span>{setting.label}</span>
                </div>
                {setting.type === 'switch' ? (
                  <Switch
                    defaultChecked={setting.default as boolean}
                    onCheckedChange={(checked) => handleSwitchChange(setting.id, checked)}
                  />
                ) : setting.type === 'slider' ? (
                  <div className="w-[200px]">
                    <Slider
                      defaultValue={[setting.default as number]}
                      max={100}
                      step={1}
                      onValueChange={(value) => handleSliderChange(setting.id, value)}
                    />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default SettingsPage;
