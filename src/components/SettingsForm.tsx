"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Save, Loader2, Plus, X } from "lucide-react";

type Settings = {
  id: string;
  base_rate: number;
  holiday_rate: number;
  holidays: string[];
  requirements: string[];
  host_name: string;
  host_location: string;
  host_bio: string;
};

export default function SettingsForm() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newHoliday, setNewHoliday] = useState("");
  const [newRequirement, setNewRequirement] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data } = await supabase.from("settings").select("*").single();
    if (data) {
      setSettings(data);
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    const { error } = await supabase
      .from("settings")
      .update(settings)
      .eq("id", settings.id);

    if (error) {
      alert("Failed to save settings: " + error.message);
    } else {
      alert("Settings saved successfully!");
    }
    setSaving(false);
  };

  const addHoliday = () => {
    if (!newHoliday || !settings) return;
    if (settings.holidays.includes(newHoliday)) return;
    setSettings({
      ...settings,
      holidays: [...settings.holidays, newHoliday].sort(),
    });
    setNewHoliday("");
  };

  const removeHoliday = (date: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      holidays: settings.holidays.filter((h) => h !== date),
    });
  };

  const addRequirement = () => {
    if (!newRequirement || !settings) return;
    setSettings({
      ...settings,
      requirements: [...settings.requirements, newRequirement],
    });
    setNewRequirement("");
  };

  const removeRequirement = (index: number) => {
    if (!settings) return;
    setSettings({
      ...settings,
      requirements: settings.requirements.filter((_, i) => i !== index),
    });
  };

  if (loading) return <div className="text-center py-12">Loading settings...</div>;
  if (!settings) return <div className="text-center py-12 text-red-500">Error loading settings.</div>;

  return (
    <form onSubmit={handleSave} className="space-y-8 bg-white p-8 rounded-2xl border border-stone-100 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-stone-900 border-b pb-2">Profile</h3>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Host Name</label>
            <input
              type="text"
              className="w-full border border-stone-300 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-amber-500"
              value={settings.host_name}
              onChange={(e) => setSettings({ ...settings, host_name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Location</label>
            <input
              type="text"
              className="w-full border border-stone-300 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-amber-500"
              value={settings.host_location}
              onChange={(e) => setSettings({ ...settings, host_location: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Bio</label>
            <textarea
              rows={4}
              className="w-full border border-stone-300 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              value={settings.host_bio}
              onChange={(e) => setSettings({ ...settings, host_bio: e.target.value })}
            />
          </div>
        </div>

        {/* Pricing & Dates */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-stone-900 border-b pb-2">Pricing & Holidays</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Base Rate ($)</label>
              <input
                type="number"
                className="w-full border border-stone-300 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                value={settings.base_rate}
                onChange={(e) => setSettings({ ...settings, base_rate: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Holiday Rate ($)</label>
              <input
                type="number"
                className="w-full border border-stone-300 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                value={settings.holiday_rate}
                onChange={(e) => setSettings({ ...settings, holiday_rate: Number(e.target.value) })}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Holidays</label>
            <div className="flex gap-2 mb-2">
              <input
                type="date"
                className="flex-1 border border-stone-300 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                value={newHoliday}
                onChange={(e) => setNewHoliday(e.target.value)}
              />
              <button
                type="button"
                onClick={addHoliday}
                className="bg-stone-100 hover:bg-stone-200 p-2 rounded-lg text-stone-600"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {settings.holidays.map((h) => (
                <span key={h} className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  {h}
                  <button type="button" onClick={() => removeHoliday(h)} className="hover:text-amber-600">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Requirements */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-stone-900 border-b pb-2">Guest Requirements</h3>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="e.g. Must be fully vaccinated"
            className="flex-1 border border-stone-300 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-amber-500"
            value={newRequirement}
            onChange={(e) => setNewRequirement(e.target.value)}
          />
          <button
            type="button"
            onClick={addRequirement}
            className="bg-stone-100 hover:bg-stone-200 p-2 rounded-lg text-stone-600"
          >
            <Plus size={20} />
          </button>
        </div>
        <ul className="space-y-2">
          {settings.requirements.map((req, i) => (
            <li key={i} className="flex items-center justify-between bg-stone-50 p-2 rounded-lg text-sm text-stone-700">
              <span>{req}</span>
              <button type="button" onClick={() => removeRequirement(i)} className="text-stone-400 hover:text-red-500">
                <X size={16} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-end pt-6 border-t">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all disabled:bg-stone-300"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          Save Changes
        </button>
      </div>
    </form>
  );
}
