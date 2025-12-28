"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Save, Loader2, Plus, X, Upload, Trash2 } from "lucide-react";

type Settings = {
  id: string;
  base_rate: number;
  holiday_rate: number;
  holidays: string[];
  requirements: string[];
  host_name: string;
  host_location: string;
  host_bio: string;
  photos: string[];
  unavailable_dates: string[];
};

export default function SettingsForm() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [newHoliday, setNewHoliday] = useState("");
  const [newUnavailableDate, setNewUnavailableDate] = useState("");
  const [newRequirement, setNewRequirement] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data } = await supabase.from("settings").select("*").single();
    if (data) {
      setSettings({ 
        ...data, 
        photos: data.photos || [],
        unavailable_dates: data.unavailable_dates || []
      });
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    const { error } = await supabase
      .from("settings")
      .update({
        base_rate: settings.base_rate,
        holiday_rate: settings.holiday_rate,
        holidays: settings.holidays,
        requirements: settings.requirements,
        host_name: settings.host_name,
        host_location: settings.host_location,
        host_bio: settings.host_bio,
        photos: settings.photos,
        unavailable_dates: settings.unavailable_dates,
      })
      .eq("id", settings.id);

    if (error) {
      alert("Failed to save settings: " + error.message);
    } else {
      alert("Settings saved successfully!");
    }
    setSaving(false);
  };

  // ... (keep drag/drop and upload handlers)

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); 
  };

  const handleDrop = (dropIndex: number) => {
    if (draggedIndex === null || draggedIndex === dropIndex || !settings) return;
    const updatedPhotos = [...settings.photos];
    const [draggedItem] = updatedPhotos.splice(draggedIndex, 1);
    updatedPhotos.splice(dropIndex, 0, draggedItem);
    setSettings({ ...settings, photos: updatedPhotos });
    setDraggedIndex(null);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !settings) return;
    setUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `public/${fileName}`;
    try {
      const { error: uploadError } = await supabase.storage.from('photos').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('photos').getPublicUrl(filePath);
      setSettings({ ...settings, photos: [...settings.photos, publicUrl] });
    } catch (error: any) {
      alert('Error uploading photo: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (index: number) => {
    if (!settings) return;
    setSettings({ ...settings, photos: settings.photos.filter((_, i) => i !== index) });
  };

  const addHoliday = () => {
    if (!newHoliday || !settings) return;
    if (settings.holidays.includes(newHoliday)) return;
    setSettings({ ...settings, holidays: [...settings.holidays, newHoliday].sort() });
    setNewHoliday("");
  };

  const removeHoliday = (date: string) => {
    if (!settings) return;
    setSettings({ ...settings, holidays: settings.holidays.filter((h) => h !== date) });
  };

  const addUnavailableDate = () => {
    if (!newUnavailableDate || !settings) return;
    if (settings.unavailable_dates.includes(newUnavailableDate)) return;
    setSettings({ 
      ...settings, 
      unavailable_dates: [...settings.unavailable_dates, newUnavailableDate].sort() 
    });
    setNewUnavailableDate("");
  };

  const removeUnavailableDate = (date: string) => {
    if (!settings) return;
    setSettings({ 
      ...settings, 
      unavailable_dates: settings.unavailable_dates.filter((d) => d !== date) 
    });
  };

  const addRequirement = () => {
    if (!newRequirement || !settings) return;
    setSettings({ ...settings, requirements: [...settings.requirements, newRequirement] });
    setNewRequirement("");
  };

  const removeRequirement = (index: number) => {
    if (!settings) return;
    setSettings({ ...settings, requirements: settings.requirements.filter((_, i) => i !== index) });
  };

  if (loading) return <div className="text-center py-12">Loading settings...</div>;
  if (!settings) return <div className="text-center py-12 text-red-500">Error loading settings.</div>;

  return (
    <form onSubmit={handleSave} className="space-y-8 bg-white p-8 rounded-2xl border border-stone-100 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-stone-900 border-b pb-2">Profile</h3>
          {/* ... (Host Name, Location, Bio inputs - kept same) */}
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
          
          {/* Photos Section */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Photos (Drag to Reorder)</label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {settings.photos.map((url, i) => (
                <div 
                  key={url} 
                  draggable
                  onDragStart={() => handleDragStart(i)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(i)}
                  className={`relative aspect-square bg-stone-100 rounded-lg overflow-hidden border border-stone-200 group cursor-move ${draggedIndex === i ? 'opacity-50' : 'opacity-100'}`}
                >
                  <img src={url} alt="Host" className="w-full h-full object-cover" />
                  {i === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center py-1 font-medium">Profile Pic</div>
                  )}
                  <button type="button" onClick={() => removePhoto(i)} className="absolute top-1 right-1 bg-white/80 hover:bg-white text-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                </div>
              ))}
              <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-stone-300 rounded-lg hover:bg-stone-50 cursor-pointer transition-colors text-stone-400 hover:text-stone-600">
                {uploading ? <Loader2 className="animate-spin" size={24} /> : <><Upload size={24} className="mb-1" /><span className="text-xs font-medium">Add Photo</span></>}
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
              </label>
            </div>
            <p className="text-xs text-stone-400">First photo is your profile picture.</p>
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
          
          {/* Holidays */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Holidays (Surge Pricing)</label>
            <div className="flex gap-2 mb-2">
              <input
                type="date"
                className="flex-1 border border-stone-300 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                value={newHoliday}
                onChange={(e) => setNewHoliday(e.target.value)}
              />
              <button type="button" onClick={addHoliday} className="bg-stone-100 hover:bg-stone-200 p-2 rounded-lg text-stone-600"><Plus size={20} /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {settings.holidays.map((h) => (
                <span key={h} className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  {h}
                  <button type="button" onClick={() => removeHoliday(h)} className="hover:text-amber-600"><X size={12} /></button>
                </span>
              ))}
            </div>
          </div>

          {/* Unavailable Dates */}
          <div className="pt-4 border-t border-stone-100">
            <label className="block text-sm font-medium text-stone-700 mb-1">Blocked Dates (Unavailable)</label>
            <div className="flex gap-2 mb-2">
              <input
                type="date"
                className="flex-1 border border-stone-300 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                value={newUnavailableDate}
                onChange={(e) => setNewUnavailableDate(e.target.value)}
              />
              <button type="button" onClick={addUnavailableDate} className="bg-stone-100 hover:bg-stone-200 p-2 rounded-lg text-stone-600"><Plus size={20} /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {settings.unavailable_dates.map((d) => (
                <span key={d} className="bg-stone-100 text-stone-600 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  {d}
                  <button type="button" onClick={() => removeUnavailableDate(d)} className="hover:text-red-500"><X size={12} /></button>
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
          <button type="button" onClick={addRequirement} className="bg-stone-100 hover:bg-stone-200 p-2 rounded-lg text-stone-600"><Plus size={20} /></button>
        </div>
        <ul className="space-y-2">
          {settings.requirements.map((req, i) => (
            <li key={i} className="flex items-center justify-between bg-stone-50 p-2 rounded-lg text-sm text-stone-700">
              <span>{req}</span>
              <button type="button" onClick={() => removeRequirement(i)} className="text-stone-400 hover:text-red-500"><X size={16} /></button>
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