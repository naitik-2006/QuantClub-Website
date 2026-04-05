'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, LogOut, Calendar as CalendarIcon, BookOpen, Download, Upload, Plus, Trash2, CheckCircle2, Users, Briefcase } from 'lucide-react';
import { CATEGORIES } from '@/data/resources';

// Admin Login Component
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) onLogin();
      else setError(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card w-full max-w-sm p-8 rounded-xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-electric-cyan/10 border border-electric-cyan/30 rounded-xl flex items-center justify-center mb-4">
            <Lock className="w-5 h-5 text-electric-cyan" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Admin Portal</h1>
          <p className="text-silver/50 text-sm font-mono tracking-wider">RESTRICTED ACCESS</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Enter password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-cyan/50 tracking-wider font-mono text-sm"
          />
          {error && <p className="text-red-400 text-xs font-mono">Invalid password</p>}
          <button
            disabled={loading || !password}
            className="w-full bg-electric-cyan text-black font-semibold tracking-wider font-mono text-sm py-3 rounded-lg hover:bg-cyan-dim disabled:opacity-50 transition-colors"
          >
            {loading ? 'AUTHENTICATING...' : 'LOGIN'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// Main Admin Dashboard
export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'events' | 'resources' | 'team' | 'opportunities' | 'backup'>('events');
  const [events, setEvents] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [team, setTeam] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [msg, setMsg] = useState('');

  // Forms
  const [newEvent, setNewEvent] = useState({ title: '', description: '', year: 2026, month: 0, day: 1, time: '18:00', type: 'WORKSHOP', format: 'IN-PERSON', location: '' });
  const [newResource, setNewResource] = useState({ title: '', description: '', category: 'FINANCE', difficulty: 'BEGINNER', href: '', iconName: 'BookOpen', tags: '' });
  const [newMember, setNewMember] = useState({ name: '', role: '', department: 'The Quant Club', section: 'LEADERSHIP', tags: '', gradient: 'from-cyan-900/40 to-cyan-800/20', linkedin: '', github: '', email: '', image: '' });
  const [newOpp, setNewOpp] = useState({ title: '', company: '', type: 'INTERNSHIP', location: '', deadline: '', tags: '', description: '', href: '' });

  const fetchData = async () => {
    fetch('/api/admin/events').then(r => r.json()).then(setEvents);
    fetch('/api/admin/resources').then(r => r.json()).then(setResources);
    fetch('/api/admin/team').then(r => r.json()).then(setTeam);
    fetch('/api/admin/opportunities').then(r => r.json()).then(setOpportunities);
  };

  useEffect(() => {
    if (authenticated) fetchData();
  }, [authenticated]);

  const showMsg = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  // Handlers
  const addEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/admin/events', { method: 'POST', body: JSON.stringify(newEvent) });
    fetchData(); showMsg('Event added.');
  };
  const delEvent = async (id: number) => {
    await fetch(`/api/admin/events?id=${id}`, { method: 'DELETE' });
    fetchData(); showMsg('Event deleted.');
  };
  
  const addResource = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...newResource, tags: newResource.tags.split(',').map(t=>t.trim()) };
    await fetch('/api/admin/resources', { method: 'POST', body: JSON.stringify(payload) });
    fetchData(); showMsg('Resource added.');
  };
  const delResource = async (id: string) => {
    await fetch(`/api/admin/resources?id=${id}`, { method: 'DELETE' });
    fetchData(); showMsg('Resource deleted.');
  };

  const addMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...newMember, tags: newMember.tags.split(',').map(t=>t.trim()) };
    await fetch('/api/admin/team', { method: 'POST', body: JSON.stringify(payload) });
    fetchData(); showMsg('Team member added.');
  };
  const delMember = async (id: number) => {
    await fetch(`/api/admin/team?id=${id}`, { method: 'DELETE' });
    fetchData(); showMsg('Team member deleted.');
  };

  const addOpp = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...newOpp, tags: newOpp.tags.split(',').map(t=>t.trim()) };
    await fetch('/api/admin/opportunities', { method: 'POST', body: JSON.stringify(payload) });
    fetchData(); showMsg('Opportunity added.');
  };
  const delOpp = async (id: string) => {
    await fetch(`/api/admin/opportunities?id=${id}`, { method: 'DELETE' });
    fetchData(); showMsg('Opportunity deleted.');
  };

  const handleBackup = async () => {
    const res = await fetch('/api/admin/backup');
    const data = await res.json();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `qc-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
  };

  const handleRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        await fetch('/api/admin/backup', { method: 'POST', body: JSON.stringify(data) });
        fetchData(); showMsg('Restored successfully.');
      } catch { showMsg('Failed to restore.'); }
    };
    reader.readAsText(file);
  };

  if (!authenticated) return <AdminLogin onLogin={() => setAuthenticated(true)} />;

  return (
    <div className="min-h-screen pt-24 pb-24 px-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-10 border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-electric-cyan/10 border border-electric-cyan/30 rounded-lg flex items-center justify-center">
            <Lock className="w-4 h-4 text-electric-cyan" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Console</h1>
            <p className="font-mono text-[0.6rem] tracking-[0.2em] text-silver/40">DATA MANAGEMENT</p>
          </div>
        </div>
        <button onClick={() => setAuthenticated(false)} className="flex items-center gap-2 font-mono text-xs text-red-400/80 hover:text-red-400 transition-colors">
          <LogOut className="w-3.5 h-3.5" /> LOGOUT
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-56 flex flex-col gap-2">
          {[
            { id: 'events', icon: CalendarIcon, label: 'EVENTS' },
            { id: 'resources', icon: BookOpen, label: 'RESOURCES' },
            { id: 'team', icon: Users, label: 'TEAM' },
            { id: 'opportunities', icon: Briefcase, label: 'OPPORTUNITIES' },
            { id: 'backup', icon: Download, label: 'BACKUPS' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-xs tracking-wider transition-all ${
                activeTab === tab.id ? 'bg-white/10 text-white' : 'text-silver/50 hover:bg-white/[0.04]'
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 glass-card p-6 sm:p-8 rounded-xl min-h-[500px]">
          {msg && (
            <div className="mb-6 flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 rounded-lg">
              <CheckCircle2 className="w-4 h-4" /> <span className="font-mono text-xs">{msg}</span>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-8">
              <div>
                <h3 className="font-mono text-xs tracking-[0.2em] text-electric-cyan mb-4 border-b border-white/5 pb-2">ADD NEW EVENT</h3>
                <form onSubmit={addEvent} className="grid grid-cols-2 gap-4">
                  <input required placeholder="Title" value={newEvent.title} onChange={e=>setNewEvent({...newEvent, title: e.target.value})} className="col-span-2 bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <input required placeholder="Year" type="number" value={newEvent.year} onChange={e=>setNewEvent({...newEvent, year: parseInt(e.target.value)})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <input required placeholder="Month (0=Jan)" type="number" min="0" max="11" value={newEvent.month} onChange={e=>setNewEvent({...newEvent, month: parseInt(e.target.value)})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <input required placeholder="Day" type="number" value={newEvent.day} onChange={e=>setNewEvent({...newEvent, day: parseInt(e.target.value)})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <input required placeholder="Time (e.g. 18:00)" value={newEvent.time} onChange={e=>setNewEvent({...newEvent, time: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <select value={newEvent.type} onChange={e=>setNewEvent({...newEvent, type: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white"><option>WORKSHOP</option><option>SEMINAR</option><option>HACKATHON</option></select>
                  <select value={newEvent.format} onChange={e=>setNewEvent({...newEvent, format: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white"><option>IN-PERSON</option><option>VIRTUAL</option></select>
                  <input required placeholder="Location" value={newEvent.location} onChange={e=>setNewEvent({...newEvent, location: e.target.value})} className="col-span-2 bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <textarea required placeholder="Description" rows={3} value={newEvent.description} onChange={e=>setNewEvent({...newEvent, description: e.target.value})} className="col-span-2 bg-white/5 border border-white/10 p-2 rounded text-sm text-white resize-none" />
                  <button type="submit" className="col-span-2 bg-electric-cyan/20 text-electric-cyan border border-electric-cyan/40 py-2 rounded text-xs font-mono tracking-wider hover:bg-electric-cyan/30">ADD EVENT</button>
                </form>
              </div>
              <div>
                <h3 className="font-mono text-xs tracking-[0.2em] text-electric-cyan mb-4 border-b border-white/5 pb-2">MANAGE EVENTS</h3>
                <div className="space-y-2">
                  {events.map(ev => (
                    <div key={ev.id} className="flex items-center justify-between bg-white/[0.02] border border-white/[0.05] p-3 rounded">
                      <div><p className="text-sm font-semibold">{ev.title}</p><p className="text-xs text-silver/50">{ev.month}/{ev.day}/{ev.year}</p></div>
                      <button onClick={()=>delEvent(ev.id)} className="text-red-400 p-2 hover:bg-red-400/10 rounded"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                  {events.length === 0 && <p className="text-xs text-silver/40 font-mono">No events found.</p>}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="space-y-8">
              <div>
                <h3 className="font-mono text-xs tracking-[0.2em] text-electric-cyan mb-4 border-b border-white/5 pb-2">ADD NEW RESOURCE</h3>
                <form onSubmit={addResource} className="grid grid-cols-2 gap-4">
                  <input required placeholder="Title" value={newResource.title} onChange={e=>setNewResource({...newResource, title: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <input required placeholder="Category (e.g. FINANCE, MACHINE LEARNING)" value={newResource.category} onChange={e=>setNewResource({...newResource, category: e.target.value.toUpperCase()})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <select value={newResource.difficulty} onChange={e=>setNewResource({...newResource, difficulty: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white"><option>BEGINNER</option><option>INTERMEDIATE</option><option>ADVANCED</option></select>
                  <input required placeholder="Tags (comma separated)" value={newResource.tags} onChange={e=>setNewResource({...newResource, tags: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <input required placeholder="URL Link" value={newResource.href} onChange={e=>setNewResource({...newResource, href: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <select value={newResource.iconName} onChange={e=>setNewResource({...newResource, iconName: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white"><option value="BookOpen">Book</option><option value="Star">Star</option><option value="Zap">Zap (Lightning)</option><option value="Calculator">Calculator</option><option value="Target">Target (Bullseye)</option><option value="ExternalLink">Link</option></select>
                  <textarea required placeholder="Description" rows={3} value={newResource.description} onChange={e=>setNewResource({...newResource, description: e.target.value})} className="col-span-2 bg-white/5 border border-white/10 p-2 rounded text-sm text-white resize-none" />
                  <button type="submit" className="col-span-2 bg-electric-cyan/20 text-electric-cyan border border-electric-cyan/40 py-2 rounded text-xs font-mono tracking-wider hover:bg-electric-cyan/30">ADD RESOURCE</button>
                </form>
              </div>
              <div>
                <h3 className="font-mono text-xs tracking-[0.2em] text-electric-cyan mb-4 border-b border-white/5 pb-2">MANAGE RESOURCES</h3>
                <div className="space-y-2">
                  {resources.map(rs => (
                    <div key={rs.id} className="flex items-center justify-between bg-white/[0.02] border border-white/[0.05] p-3 rounded">
                      <div><p className="text-sm font-semibold">{rs.title}</p><p className="text-xs text-silver/50 truncate max-w-sm">{rs.href}</p></div>
                      <button onClick={()=>delResource(rs.id)} className="text-red-400 p-2 hover:bg-red-400/10 rounded"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                  {resources.length === 0 && <p className="text-xs text-silver/40 font-mono">No resources found.</p>}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-8">
              <div>
                <h3 className="font-mono text-xs tracking-[0.2em] text-electric-cyan mb-4 border-b border-white/5 pb-2">ADD TEAM MEMBER</h3>
                <form onSubmit={addMember} className="grid grid-cols-2 gap-4">
                  <input required placeholder="Name" value={newMember.name} onChange={e=>setNewMember({...newMember, name: e.target.value})} className="col-span-2 bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <input required placeholder="Role (e.g. ML LEAD)" value={newMember.role} onChange={e=>setNewMember({...newMember, role: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <input required placeholder="Department" value={newMember.department} onChange={e=>setNewMember({...newMember, department: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <input required placeholder="Section (e.g. LEADERSHIP, ALUMNI)" value={newMember.section} onChange={e=>setNewMember({...newMember, section: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <input required placeholder="Tags (comma separated)" value={newMember.tags} onChange={e=>setNewMember({...newMember, tags: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <input placeholder="Photo URL (optional)" value={newMember.image} onChange={e=>setNewMember({...newMember, image: e.target.value})} className="col-span-2 bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <input placeholder="LinkedIn URL (optional)" value={newMember.linkedin} onChange={e=>setNewMember({...newMember, linkedin: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <input placeholder="GitHub URL (optional)" value={newMember.github} onChange={e=>setNewMember({...newMember, github: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <input placeholder="Email (optional)" value={newMember.email} onChange={e=>setNewMember({...newMember, email: e.target.value})} className="col-span-2 bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <button type="submit" className="col-span-2 bg-electric-cyan/20 text-electric-cyan border border-electric-cyan/40 py-2 rounded text-xs font-mono tracking-wider hover:bg-electric-cyan/30">ADD MEMBER</button>
                </form>
              </div>
              <div>
                <h3 className="font-mono text-xs tracking-[0.2em] text-electric-cyan mb-4 border-b border-white/5 pb-2">MANAGE TEAM</h3>
                <div className="space-y-2">
                  {team.map(m => (
                    <div key={m.id} className="flex items-center justify-between bg-white/[0.02] border border-white/[0.05] p-3 rounded">
                      <div><p className="text-sm font-semibold">{m.name} <span className="text-silver/50 text-xs">({m.section})</span></p><p className="text-xs text-silver/50">{m.role}</p></div>
                      <button onClick={()=>delMember(m.id)} className="text-red-400 p-2 hover:bg-red-400/10 rounded"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                  {team.length === 0 && <p className="text-xs text-silver/40 font-mono">No team members found.</p>}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'opportunities' && (
            <div className="space-y-8">
              <div>
                <h3 className="font-mono text-xs tracking-[0.2em] text-electric-cyan mb-4 border-b border-white/5 pb-2">ADD OPPORTUNITY</h3>
                <form onSubmit={addOpp} className="grid grid-cols-2 gap-4">
                  <input required placeholder="Title" value={newOpp.title} onChange={e=>setNewOpp({...newOpp, title: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <input required placeholder="Company" value={newOpp.company} onChange={e=>setNewOpp({...newOpp, company: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <input required placeholder="Location" value={newOpp.location} onChange={e=>setNewOpp({...newOpp, location: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <select value={newOpp.type} onChange={e=>setNewOpp({...newOpp, type: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white"><option>INTERNSHIP</option><option>FULL-TIME</option><option>COMPETITION</option></select>
                  <input placeholder="Deadline (Optional)" value={newOpp.deadline} onChange={e=>setNewOpp({...newOpp, deadline: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <input required placeholder="Tags (comma separated)" value={newOpp.tags} onChange={e=>setNewOpp({...newOpp, tags: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <input required placeholder="URL Link" value={newOpp.href} onChange={e=>setNewOpp({...newOpp, href: e.target.value})} className="col-span-2 bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <textarea required placeholder="Description" rows={3} value={newOpp.description} onChange={e=>setNewOpp({...newOpp, description: e.target.value})} className="col-span-2 bg-white/5 border border-white/10 p-2 rounded text-sm text-white resize-none" />
                  <button type="submit" className="col-span-2 bg-electric-cyan/20 text-electric-cyan border border-electric-cyan/40 py-2 rounded text-xs font-mono tracking-wider hover:bg-electric-cyan/30">ADD OPPORTUNITY</button>
                </form>
              </div>
              <div>
                <h3 className="font-mono text-xs tracking-[0.2em] text-electric-cyan mb-4 border-b border-white/5 pb-2">MANAGE OPPORTUNITIES</h3>
                <div className="space-y-2">
                  {opportunities.map(o => (
                    <div key={o.id} className="flex items-center justify-between bg-white/[0.02] border border-white/[0.05] p-3 rounded">
                      <div><p className="text-sm font-semibold">{o.title} <span className="text-silver/50 text-xs">@ {o.company}</span></p></div>
                      <button onClick={()=>delOpp(o.id)} className="text-red-400 p-2 hover:bg-red-400/10 rounded"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                  {opportunities.length === 0 && <p className="text-xs text-silver/40 font-mono">No opportunities found.</p>}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="space-y-8 flex flex-col items-center justify-center text-center pt-10">
              <Download className="w-12 h-12 text-electric-cyan opacity-50 mb-4" />
              <div className="max-w-md">
                <h2 className="text-xl font-bold mb-2">Data Persistence Engine</h2>
                <p className="text-sm text-silver/70 mb-8 leading-relaxed">
                  All custom events and resources are stored locally as JSON files. You can download a backup now. If you redeploy the site from scratch, simply upload the backup here to restore all missing data.
                </p>
                <div className="flex gap-4 justify-center">
                  <button onClick={handleBackup} className="flex items-center gap-2 bg-electric-cyan text-black px-6 py-3 rounded-lg font-mono text-xs font-bold tracking-wider hover:bg-cyan-dim">
                    <Download className="w-4 h-4" /> EXPORT BACKUP
                  </button>
                  <label className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-6 py-3 rounded-lg font-mono text-xs tracking-wider cursor-pointer hover:bg-white/10">
                    <Upload className="w-4 h-4" /> IMPORT DATA
                    <input type="file" accept=".json" onChange={handleRestore} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
