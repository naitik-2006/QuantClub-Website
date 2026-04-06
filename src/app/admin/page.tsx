'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, LogOut, Calendar as CalendarIcon, BookOpen, Download, Upload, Trash2, Pencil, X, CheckCircle2, Users, Briefcase, Trophy, BarChart, MessageSquare, GripVertical } from 'lucide-react';

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(false);
    try {
      const res = await fetch('/api/admin/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
      if (res.ok) onLogin(); else setError(true);
    } catch { setError(true); } finally { setLoading(false); }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#030303]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card w-full max-w-sm p-8 rounded-xl border border-white/10">
        <div className="flex flex-col items-center mb-8">
          <Lock className="w-8 h-8 text-electric-cyan mb-4" />
          <h1 className="text-xl font-bold text-white">Admin System</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded px-4 py-2 text-white outline-none" />
          {error && <p className="text-red-400 text-xs text-center">Invalid password</p>}
          <button className="w-full bg-electric-cyan text-black font-bold py-2 rounded text-sm tracking-widest">{loading ? '...' : 'LOGIN'}</button>
        </form>
      </motion.div>
    </div>
  );
}

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'team' | 'events' | 'resources' | 'opportunities' | 'achievements' | 'projects' | 'messages' | 'backup'>('team');
  const [msg, setMsg] = useState('');
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<string | number | null>(null);

  // Data
  const [events, setEvents] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [team, setTeam] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  // Unique ordered sections for Team
  const [sections, setSections] = useState<string[]>([]);
  useEffect(() => {
    const secMap: Record<string, number> = {};
    team.forEach(m => {
      if (secMap[m.section] === undefined || (m.sectionOrder !== undefined && m.sectionOrder < secMap[m.section])) {
        secMap[m.section] = m.sectionOrder ?? 99;
      }
    });
    setSections(Object.keys(secMap).sort((a,b) => secMap[a] - secMap[b]));
  }, [team]);

  // Forms
  const initEvent = { title: '', description: '', year: 2026, month: 0, day: 1, time: '18:00', type: 'WORKSHOP', format: 'IN-PERSON', location: '' };
  const initRes = { title: '', description: '', category: 'FINANCE', difficulty: 'BEGINNER', href: '', iconName: 'BookOpen', tags: '' };
  const initMem = { name: '', role: '', department: 'The Quant Club', section: 'LEADERSHIP', tags: '', gradient: 'from-cyan-900/40 to-cyan-800/20', linkedin: '', github: '', email: '', image: '' };
  const initOpp = { title: '', company: '', type: 'INTERNSHIP', location: '', deadline: '', tags: '', description: '', href: '' };
  const initAch = { title: '', rank: '', subtitle: '', description: '', icon: 'Trophy', color: '#FFD700', glow: 'rgba(255,215,0,0.15)', gradient: 'from-amber-500/20 to-transparent', href: '', github: '' };
  const initProj = { title: '', description: '', icon: 'BarChart2', tags: '', href: '', github: '' };

  const [newEvent, setNewEvent] = useState(initEvent);
  const [newResource, setNewResource] = useState(initRes);
  const [newMember, setNewMember] = useState(initMem);
  const [memberImageFile, setMemberImageFile] = useState<File | null>(null);
  const [newOpp, setNewOpp] = useState(initOpp);
  const [newAch, setNewAch] = useState(initAch);
  const [newProj, setNewProj] = useState(initProj);

  const fetchData = async () => {
    fetch('/api/admin/events').then(r => r.json()).then(setEvents);
    fetch('/api/admin/resources').then(r => r.json()).then(setResources);
    fetch('/api/admin/team').then(r => r.json()).then(d=>setTeam([...d].sort((a,b)=>(a.order??99)-(b.order??99))));
    fetch('/api/admin/opportunities').then(r => r.json()).then(setOpportunities);
    fetch('/api/admin/achievements').then(r => r.ok?r.json():[]).then(d=>setAchievements([...d].sort((a,b)=>(a.order??99)-(b.order??99))));
    fetch('/api/admin/projects').then(r => r.ok?r.json():[]).then(d=>setProjects([...d].sort((a,b)=>(a.order??99)-(b.order??99))));
    fetch('/api/admin/messages').then(r => r.ok?r.json():[]).then(setMessages);
  };

  useEffect(() => { if (authenticated) fetchData(); }, [authenticated]);
  const showMsg = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const safeFetch = async (url: string, method: string, body?: any) => {
    const res = await fetch(url, { method, headers: body ? { 'Content-Type': 'application/json' } : undefined, body: body ? JSON.stringify(body) : undefined });
    if (res.status === 401) { setAuthenticated(false); throw new Error('Unauthorized'); }
    if (!res.ok) throw new Error('Request failed');
    return res;
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.url;
  };

  const saveOrder = async (endpoint: string, items: any[]) => {
    await safeFetch(endpoint, 'PUT', { ids: items.map(i => i.id) });
    showMsg('Order saved.'); fetchData();
  };

  const handleDragSort = (items: any[], draggedId: any, targetId: any) => {
    const copy = [...items];
    const dragIdx = copy.findIndex(i => (i.id ? i.id === draggedId : i === draggedId));
    const targetIdx = copy.findIndex(i => (i.id ? i.id === targetId : i === targetId));
    const [dragged] = copy.splice(dragIdx, 1);
    copy.splice(targetIdx, 0, dragged);
    return copy;
  };

  // Add/Edit Handlers
  const addEvent = async (e: React.FormEvent) => { 
    e.preventDefault(); 
    try { 
      const method = editingId ? 'PUT' : 'POST';
      await safeFetch('/api/admin/events', method, editingId ? { ...newEvent, id: editingId } : newEvent); 
      fetchData(); showMsg(editingId ? 'Event updated.' : 'Event added.'); setNewEvent(initEvent); setEditingId(null);
    } catch { showMsg('Failed.'); } 
  };

  const addResource = async (e: React.FormEvent) => { 
    e.preventDefault(); 
    try { 
      const method = editingId ? 'PUT' : 'POST';
      const tags = typeof newResource.tags === 'string' ? newResource.tags.split(',').map(t=>t.trim()) : newResource.tags;
      await safeFetch('/api/admin/resources', method, { ...newResource, id: editingId || undefined, tags }); 
      fetchData(); showMsg(editingId ? 'Resource updated.' : 'Resource added.'); setNewResource(initRes); setEditingId(null);
    } catch { showMsg('Failed.'); } 
  };

  const addMember = async (e: React.FormEvent) => { 
    e.preventDefault(); 
    try { 
      let imageUrl = newMember.image;
      if (memberImageFile) { showMsg('Uploading...'); imageUrl = await uploadFile(memberImageFile); }
      const method = editingId ? 'PUT' : 'POST';
      const tags = typeof newMember.tags === 'string' ? newMember.tags.split(',').map(t=>t.trim()) : newMember.tags;
      await safeFetch('/api/admin/team', method, { ...newMember, id: editingId || undefined, image: imageUrl, tags }); 
      fetchData(); showMsg(editingId ? 'Member updated.' : 'Member added.'); setNewMember(initMem); setMemberImageFile(null); setEditingId(null);
    } catch { showMsg('Failed.'); } 
  };

  const addOpp = async (e: React.FormEvent) => { 
    e.preventDefault(); 
    try { 
      const method = editingId ? 'PUT' : 'POST';
      const tags = typeof newOpp.tags === 'string' ? newOpp.tags.split(',').map(t=>t.trim()) : newOpp.tags;
      await safeFetch('/api/admin/opportunities', method, { ...newOpp, id: editingId || undefined, tags }); 
      fetchData(); showMsg(editingId ? 'Opportunity updated.' : 'Opportunity added.'); setNewOpp(initOpp); setEditingId(null);
    } catch { showMsg('Failed.'); } 
  };

  const addAch = async (e: React.FormEvent) => { 
    e.preventDefault(); 
    try { 
      const method = editingId ? 'PUT' : 'POST';
      await safeFetch('/api/admin/achievements', method, { ...newAch, id: editingId || undefined }); 
      fetchData(); showMsg(editingId ? 'Achievement updated.' : 'Achievement Added.'); setNewAch(initAch); setEditingId(null);
    } catch { showMsg('Failed.'); } 
  };

  const addProj = async (e: React.FormEvent) => { 
    e.preventDefault(); 
    try { 
      const method = editingId ? 'PUT' : 'POST';
      const tags = typeof newProj.tags === 'string' ? newProj.tags.split(',').map(t=>t.trim()) : newProj.tags;
      await safeFetch('/api/admin/projects', method, { ...newProj, id: editingId || undefined, tags }); 
      fetchData(); showMsg(editingId ? 'Project updated.' : 'Project Added.'); setNewProj(initProj); setEditingId(null);
    } catch { showMsg('Failed.'); } 
  };

  const startEdit = (category: string, item: any) => {
    setEditingId(item.id);
    const tagsStr = Array.isArray(item.tags) ? item.tags.join(', ') : item.tags;
    if (category === 'team') { setNewMember({ ...item, tags: tagsStr }); setActiveTab('team'); }
    if (category === 'achievements') { setNewAch({ ...item }); setActiveTab('achievements'); }
    if (category === 'projects') { setNewProj({ ...item, tags: tagsStr }); setActiveTab('projects'); }
    if (category === 'events') { setNewEvent({ ...item }); setActiveTab('events'); }
    if (category === 'resources') { setNewResource({ ...item, tags: tagsStr }); setActiveTab('resources'); }
    if (category === 'opportunities') { setNewOpp({ ...item, tags: tagsStr }); setActiveTab('opportunities'); }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewMember(initMem); setNewEvent(initEvent); setNewAch(initAch); setNewProj(initProj); setNewResource(initRes); setNewOpp(initOpp);
  };

  if (!authenticated) return <AdminLogin onLogin={() => setAuthenticated(true)} />;

  return (
    <div className="min-h-screen pt-24 pb-24 px-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-10 border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-electric-cyan/10 border border-electric-cyan/30 rounded-lg flex items-center justify-center">
            <Lock className="w-4 h-4 text-electric-cyan" />
          </div>
          <div><h1 className="text-3xl font-bold tracking-tight text-white">Console</h1><p className="font-mono text-[0.6rem] tracking-[0.2em] text-silver/40">DATA MANAGEMENT</p></div>
        </div>
        <button onClick={() => { fetch('/api/admin/auth', { method: 'DELETE' }); setAuthenticated(false); }} className="flex items-center gap-2 font-mono text-xs text-red-400 hover:text-red-300">
          <LogOut className="w-3.5 h-3.5" /> LOGOUT
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-56 flex flex-col gap-2">
          {[ 
            { id: 'team', icon: Users, label: 'TEAM' }, { id: 'achievements', icon: Trophy, label: 'ACHIEVEMENTS' },
            { id: 'projects', icon: BarChart, label: 'PROJECTS' }, { id: 'events', icon: CalendarIcon, label: 'EVENTS' },
            { id: 'resources', icon: BookOpen, label: 'RESOURCES' }, { id: 'opportunities', icon: Briefcase, label: 'OPPORTUNITIES' },
            { id: 'messages', icon: MessageSquare, label: 'MESSAGES' }, { id: 'backup', icon: Download, label: 'BACKUPS' }
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id as any)} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-xs tracking-wider transition-all ${activeTab === t.id ? 'bg-white/10 text-white' : 'text-silver/50 hover:bg-white/[0.04]'}`}>
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 glass-card p-6 sm:p-8 rounded-xl min-h-[500px]">
          {msg && <div className="mb-6 flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-4 py-3 rounded-lg border border-emerald-500/20"><CheckCircle2 className="w-4 h-4" /> <span className="font-mono text-xs">{msg}</span></div>}

          {/* TEAM */}
          {activeTab === 'team' && (
            <div className="space-y-8">
              <div>
                <h3 className="font-mono text-xs tracking-[0.2em] text-electric-cyan mb-4 border-b border-white/5 pb-2">{editingId ? 'EDIT' : 'ADD'} TEAM MEMBER</h3>
                <form onSubmit={addMember} className="grid grid-cols-2 gap-4">
                  <input required placeholder="Name" value={newMember.name} onChange={e=>setNewMember({...newMember, name: e.target.value})} className="col-span-2 bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <input required placeholder="Role (e.g. ML LEAD)" value={newMember.role} onChange={e=>setNewMember({...newMember, role: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <input required placeholder="Department" value={newMember.department} onChange={e=>setNewMember({...newMember, department: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <input required placeholder="Section (e.g. LEADERSHIP, ALUMNI)" value={newMember.section} onChange={e=>setNewMember({...newMember, section: e.target.value})} className="col-span-2 bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <input required placeholder="Tags (comma separated)" value={newMember.tags} onChange={e=>setNewMember({...newMember, tags: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <div className="flex gap-2">
                    <input type="file" accept="image/*" onChange={e=>setMemberImageFile(e.target.files?.[0]||null)} className="w-full bg-white/5 border border-white/10 p-1.5 rounded text-sm text-white" />
                  </div>
                  <input placeholder="LinkedIn URL (optional)" value={newMember.linkedin} onChange={e=>setNewMember({...newMember, linkedin: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <input placeholder="GitHub URL (optional)" value={newMember.github} onChange={e=>setNewMember({...newMember, github: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <input placeholder="Email (optional)" value={newMember.email} onChange={e=>setNewMember({...newMember, email: e.target.value})} className="col-span-2 bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <div className="col-span-2 flex gap-2">
                    <button type="submit" className="flex-1 bg-electric-cyan/20 text-electric-cyan py-2 rounded text-xs font-bold tracking-wider hover:bg-electric-cyan/30">{editingId ? 'UPDATE' : 'ADD'} MEMBER</button>
                    {editingId && <button type="button" onClick={cancelEdit} className="px-4 bg-white/5 border border-white/10 text-white rounded hover:bg-white/10"><X className="w-4 h-4" /></button>}
                  </div>
                </form>
              </div>

              <div>
                <h3 className="font-mono text-xs tracking-[0.2em] text-electric-cyan mb-4 border-b border-white/5 pb-2 flex justify-between items-end">
                  <span>MANAGE SECTIONS<br/><span className="text-[10px] text-silver/50 tracking-wide">Drag to reorder Team groups</span></span>
                  <button onClick={async()=>{ await safeFetch('/api/admin/team/section-order', 'PUT', { sections }); showMsg('Section order saved.'); fetchData(); }} className="bg-white/10 px-3 py-1 rounded hover:bg-white/20">SAVE</button>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {sections.map((sec, idx) => (
                    <div key={sec} draggable onDragStart={()=>setDraggedIdx(idx)} onDragOver={e=>e.preventDefault()} onDrop={()=>{ if(draggedIdx !== null) { setSections(handleDragSort(sections, sections[draggedIdx], sec)); setDraggedIdx(null); } }} className="flex items-center gap-2 bg-white/[0.05] border border-white/10 px-3 py-1.5 rounded cursor-move hover:border-white/30 text-xs">
                      <GripVertical className="w-3 h-3 text-silver/50" /> {sec}
                    </div>
                  ))}
                  {sections.length===0 && <p className="text-xs text-silver/40">No sections.</p>}
                </div>
              </div>

              <div>
                <h3 className="font-mono text-xs tracking-[0.2em] text-electric-cyan mb-4 border-b border-white/5 pb-2 flex justify-between">
                  MANAGE TEAM <button onClick={()=>saveOrder('/api/admin/team/order', team)} className="bg-white/10 px-3 py-1 rounded hover:bg-white/20">SAVE ORDER</button>
                </h3>
                <div className="space-y-2">
                  {team.map((m, idx) => (
                    <div key={m.id} draggable onDragStart={() => setDraggedIdx(idx)} onDragOver={(e) => e.preventDefault()} onDrop={() => { if (draggedIdx !== null) { setTeam(handleDragSort(team, team[draggedIdx].id, m.id)); setDraggedIdx(null); } }} className="flex justify-between items-center bg-white/[0.02] border border-white/[0.05] p-3 rounded cursor-move hover:border-white/20">
                      <div className="flex gap-3 items-center">
                        <GripVertical className="text-silver/50" />
                        <div><p className="text-sm font-semibold">{m.name} <span className="text-silver/50 text-xs text-electric-cyan">({m.section})</span></p><p className="text-xs text-silver/50">{m.role}</p></div>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => startEdit('team', m)} className="text-electric-cyan p-2 hover:bg-electric-cyan/10 rounded"><Pencil className="w-4 h-4" /></button>
                        <button onClick={async ()=>{ await safeFetch(`/api/admin/team?id=${m.id}`, 'DELETE'); fetchData(); }} className="text-red-400 p-2 hover:bg-red-400/10 rounded"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                  {team.length === 0 && <p className="text-xs text-silver/40">No members found.</p>}
                </div>
              </div>
            </div>
          )}

          {/* ACHIEVEMENTS */}
          {activeTab === 'achievements' && (
            <div className="space-y-8">
              <div>
                <h3 className="font-mono text-xs tracking-[0.2em] text-electric-cyan mb-4 border-b border-white/5 pb-2">{editingId ? 'EDIT' : 'ADD'} ACHIEVEMENT</h3>
                <form onSubmit={addAch} className="grid grid-cols-2 gap-4">
                  <input required placeholder="Title" value={newAch.title} onChange={e=>setNewAch({...newAch, title: e.target.value})} className="col-span-2 bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <input required placeholder="Rank (e.g. #3)" value={newAch.rank} onChange={e=>setNewAch({...newAch, rank: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <input required placeholder="Subtitle" value={newAch.subtitle} onChange={e=>setNewAch({...newAch, subtitle: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <input placeholder="Project link (optional)" value={newAch.href} onChange={e=>setNewAch({...newAch, href: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <input placeholder="GitHub link (optional)" value={newAch.github} onChange={e=>setNewAch({...newAch, github: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <textarea required placeholder="Description" rows={3} value={newAch.description} onChange={e=>setNewAch({...newAch, description: e.target.value})} className="col-span-2 bg-white/5 border border-white/10 p-2 rounded text-sm text-white resize-none" />
                  <div className="col-span-2 flex gap-2">
                    <button type="submit" className="flex-1 bg-electric-cyan/20 text-electric-cyan py-2 rounded text-xs font-bold tracking-wider hover:bg-electric-cyan/30">{editingId ? 'UPDATE' : 'ADD'} ACHIEVEMENT</button>
                    {editingId && <button type="button" onClick={cancelEdit} className="px-4 bg-white/5 border border-white/10 text-white rounded hover:bg-white/10"><X className="w-4 h-4" /></button>}
                  </div>
                </form>
              </div>
              <div>
                <h3 className="font-mono text-xs tracking-[0.2em] text-electric-cyan mb-4 border-b border-white/5 pb-2 flex justify-between">
                  MANAGE ACHIEVEMENTS <button onClick={()=>saveOrder('/api/admin/achievements/order', achievements)} className="bg-white/10 px-3 py-1 rounded hover:bg-white/20">SAVE ORDER</button>
                </h3>
                <div className="space-y-2">
                  {achievements.map((item, idx) => (
                    <div key={item.id} draggable onDragStart={() => setDraggedIdx(idx)} onDragOver={(e) => e.preventDefault()} onDrop={() => { if (draggedIdx !== null) { setAchievements(handleDragSort(achievements, achievements[draggedIdx].id, item.id)); setDraggedIdx(null); } }} className="flex justify-between items-center bg-white/[0.02] border border-white/[0.05] p-3 rounded cursor-move hover:border-white/20">
                      <div className="flex gap-3 items-center"><GripVertical className="text-silver/50" /><p className="text-sm font-semibold">{item.title}</p></div>
                      <div className="flex gap-1">
                        <button onClick={() => startEdit('achievements', item)} className="text-electric-cyan p-2 hover:bg-electric-cyan/10 rounded"><Pencil className="w-4 h-4" /></button>
                        <button onClick={async ()=>{ await safeFetch(`/api/admin/achievements?id=${item.id}`, 'DELETE'); fetchData(); }} className="text-red-400 p-2 hover:bg-red-400/10 rounded"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-8">
              <div>
                <h3 className="font-mono text-xs tracking-[0.2em] text-electric-cyan mb-4 border-b border-white/5 pb-2">{editingId ? 'EDIT' : 'ADD'} PROJECT</h3>
                <form onSubmit={addProj} className="grid grid-cols-2 gap-4">
                  <input required placeholder="Title" value={newProj.title} onChange={e=>setNewProj({...newProj, title: e.target.value})} className="col-span-2 bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <textarea required placeholder="Description" rows={3} value={newProj.description} onChange={e=>setNewProj({...newProj, description: e.target.value})} className="col-span-2 bg-white/5 border border-white/10 p-2 rounded text-sm text-white resize-none" />
                  <input required placeholder="Tags (comma sep)" value={newProj.tags} onChange={e=>setNewProj({...newProj, tags: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <input required placeholder="Icon Name" value={newProj.icon} onChange={e=>setNewProj({...newProj, icon: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <input placeholder="Project Link (optional)" value={newProj.href} onChange={e=>setNewProj({...newProj, href: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <input placeholder="GitHub Link (optional)" value={newProj.github} onChange={e=>setNewProj({...newProj, github: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <div className="col-span-2 flex gap-2">
                    <button type="submit" className="flex-1 bg-electric-cyan/20 text-electric-cyan py-2 rounded text-xs font-bold tracking-wider hover:bg-electric-cyan/30">{editingId ? 'UPDATE' : 'ADD'} PROJECT</button>
                    {editingId && <button type="button" onClick={cancelEdit} className="px-4 bg-white/5 border border-white/10 text-white rounded hover:bg-white/10"><X className="w-4 h-4" /></button>}
                  </div>
                </form>
              </div>
              <div>
                 <h3 className="font-mono text-xs tracking-[0.2em] text-electric-cyan mb-4 border-b border-white/5 pb-2 flex justify-between">
                  MANAGE PROJECTS <button onClick={()=>saveOrder('/api/admin/projects/order', projects)} className="bg-white/10 px-3 py-1 rounded hover:bg-white/20">SAVE ORDER</button>
                </h3>
                 <div className="space-y-2">
                  {projects.map((item, idx) => (
                    <div key={item.id} draggable onDragStart={() => setDraggedIdx(idx)} onDragOver={(e) => e.preventDefault()} onDrop={() => { if (draggedIdx !== null) { setProjects(handleDragSort(projects, projects[draggedIdx].id, item.id)); setDraggedIdx(null); } }} className="flex justify-between items-center bg-white/[0.02] border border-white/[0.05] p-3 rounded cursor-move hover:border-white/20">
                      <div className="flex gap-3 items-center"><GripVertical className="text-silver/50" /><p className="text-sm font-semibold">{item.title}</p></div>
                      <div className="flex gap-1">
                        <button onClick={() => startEdit('projects', item)} className="text-electric-cyan p-2 hover:bg-electric-cyan/10 rounded"><Pencil className="w-4 h-4" /></button>
                        <button onClick={async ()=>{ await safeFetch(`/api/admin/projects?id=${item.id}`, 'DELETE'); fetchData(); }} className="text-red-400 p-2 hover:bg-red-400/10 rounded"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MESSAGES */}
          {activeTab === 'messages' && (
            <div className="space-y-8">
              <h3 className="font-mono text-xs tracking-[0.2em] text-electric-cyan mb-4 border-b border-white/5 pb-2">CONTACT MESSAGES</h3>
              <div className="space-y-4">
                 {messages.length === 0 && <p className="text-silver/50 text-sm">No messages.</p>}
                 {messages.map(m => (
                   <div key={m.id} className={`p-4 rounded border ${m.read ? 'bg-white/5 border-white/10' : 'bg-electric-cyan/5 border-electric-cyan/30'} flex flex-col gap-2`}>
                     <div className="flex justify-between items-start">
                       <div><p className="font-bold text-white text-md">{m.subject}</p><p className="text-xs text-silver tracking-wider">{m.name} &lt;{m.email}&gt; • {new Date(m.timestamp).toLocaleDateString()}</p></div>
                       <div className="flex gap-2">
                         {!m.read && <button onClick={async ()=>{ await safeFetch(`/api/admin/messages?id=${m.id}`, 'PATCH'); fetchData(); }} className="text-xs border text-emerald-400 px-2 rounded hover:bg-emerald-400/20">READ</button>}
                         <button onClick={async ()=>{ await safeFetch(`/api/admin/messages?id=${m.id}`, 'DELETE'); fetchData(); }} className="text-red-400 p-1.5 rounded hover:bg-red-400/20"><Trash2 className="w-4"/></button>
                       </div>
                     </div>
                     <p className="text-sm text-silver/80 mt-2 whitespace-pre-wrap">{m.message}</p>
                   </div>
                 ))}
              </div>
            </div>
          )}

          {/* EVENTS */}
          {activeTab === 'events' && (
            <div className="space-y-8">
              <div>
                <h3 className="font-mono text-xs tracking-[0.2em] text-electric-cyan mb-4 border-b border-white/5 pb-2">{editingId ? 'EDIT' : 'ADD'} EVENT</h3>
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
                  <div className="col-span-2 flex gap-2">
                    <button type="submit" className="flex-1 bg-electric-cyan/20 text-electric-cyan py-2 rounded text-xs font-bold tracking-wider hover:bg-electric-cyan/30">{editingId ? 'UPDATE' : 'ADD'} EVENT</button>
                    {editingId && <button type="button" onClick={cancelEdit} className="px-4 bg-white/5 border border-white/10 text-white rounded hover:bg-white/10"><X className="w-4 h-4" /></button>}
                  </div>
                </form>
              </div>
              <div>
                <h3 className="font-mono text-xs tracking-[0.2em] text-electric-cyan mb-4 border-b border-white/5 pb-2">MANAGE EVENTS</h3>
                <div className="space-y-2">
                  {events.map(ev => (
                    <div key={ev.id} className="flex items-center justify-between bg-white/[0.02] border border-white/[0.05] p-3 rounded">
                      <div><p className="text-sm font-semibold">{ev.title}</p><p className="text-xs text-silver/50">{ev.month}/{ev.day}/{ev.year}</p></div>
                      <div className="flex gap-1">
                        <button onClick={() => startEdit('events', ev)} className="text-electric-cyan p-2 hover:bg-electric-cyan/10 rounded"><Pencil className="w-4 h-4" /></button>
                        <button onClick={async ()=>{ await safeFetch(`/api/admin/events?id=${ev.id}`, 'DELETE'); fetchData(); showMsg("Deleted"); }} className="text-red-400 p-2 hover:bg-red-400/10 rounded"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                  {events.length === 0 && <p className="text-xs text-silver/40 font-mono">No events found.</p>}
                </div>
              </div>
            </div>
          )}

          {/* RESOURCES */}
          {activeTab === 'resources' && (
            <div className="space-y-8">
              <div>
                <h3 className="font-mono text-xs tracking-[0.2em] text-electric-cyan mb-4 border-b border-white/5 pb-2">{editingId ? 'EDIT' : 'ADD'} RESOURCE</h3>
                <form onSubmit={addResource} className="grid grid-cols-2 gap-4">
                  <input required placeholder="Title" value={newResource.title} onChange={e=>setNewResource({...newResource, title: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <input required placeholder="Category" value={newResource.category} onChange={e=>setNewResource({...newResource, category: e.target.value.toUpperCase()})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <select value={newResource.difficulty} onChange={e=>setNewResource({...newResource, difficulty: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white"><option>BEGINNER</option><option>INTERMEDIATE</option><option>ADVANCED</option></select>
                  <input required placeholder="Tags (comma separated)" value={newResource.tags} onChange={e=>setNewResource({...newResource, tags: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <input required placeholder="URL Link" value={newResource.href} onChange={e=>setNewResource({...newResource, href: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <select value={newResource.iconName} onChange={e=>setNewResource({...newResource, iconName: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white"><option value="BookOpen">Book</option><option value="Star">Star</option><option value="Zap">Zap (Lightning)</option><option value="Calculator">Calculator</option><option value="Target">Target (Bullseye)</option><option value="ExternalLink">Link</option></select>
                  <textarea required placeholder="Description" rows={3} value={newResource.description} onChange={e=>setNewResource({...newResource, description: e.target.value})} className="col-span-2 bg-white/5 border border-white/10 p-2 rounded text-sm text-white resize-none" />
                  <div className="col-span-2 flex gap-2">
                    <button type="submit" className="flex-1 bg-electric-cyan/20 text-electric-cyan py-2 rounded text-xs font-bold tracking-wider hover:bg-electric-cyan/30">{editingId ? 'UPDATE' : 'ADD'} RESOURCE</button>
                    {editingId && <button type="button" onClick={cancelEdit} className="px-4 bg-white/5 border border-white/10 text-white rounded hover:bg-white/10"><X className="w-4 h-4" /></button>}
                  </div>
                </form>
              </div>
              <div>
                <h3 className="font-mono text-xs tracking-[0.2em] text-electric-cyan mb-4 border-b border-white/5 pb-2">MANAGE RESOURCES</h3>
                <div className="space-y-2">
                  {resources.map(rs => (
                    <div key={rs.id} className="flex items-center justify-between bg-white/[0.02] border border-white/[0.05] p-3 rounded">
                      <div><p className="text-sm font-semibold">{rs.title}</p><p className="text-xs text-silver/50 truncate max-w-sm">{rs.href}</p></div>
                      <div className="flex gap-1">
                        <button onClick={() => startEdit('resources', rs)} className="text-electric-cyan p-2 hover:bg-electric-cyan/10 rounded"><Pencil className="w-4 h-4" /></button>
                        <button onClick={async()=>{ await safeFetch(`/api/admin/resources?id=${rs.id}`, 'DELETE'); fetchData(); showMsg("Deleted"); }} className="text-red-400 p-2 hover:bg-red-400/10 rounded"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                  {resources.length === 0 && <p className="text-xs text-silver/40 font-mono">No resources found.</p>}
                </div>
              </div>
            </div>
          )}

          {/* OPPORTUNITIES */}
          {activeTab === 'opportunities' && (
            <div className="space-y-8">
              <div>
                <h3 className="font-mono text-xs tracking-[0.2em] text-electric-cyan mb-4 border-b border-white/5 pb-2">{editingId ? 'EDIT' : 'ADD'} OPPORTUNITY</h3>
                <form onSubmit={addOpp} className="grid grid-cols-2 gap-4">
                  <input required placeholder="Title" value={newOpp.title} onChange={e=>setNewOpp({...newOpp, title: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <input required placeholder="Company" value={newOpp.company} onChange={e=>setNewOpp({...newOpp, company: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <input required placeholder="Location" value={newOpp.location} onChange={e=>setNewOpp({...newOpp, location: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <select value={newOpp.type} onChange={e=>setNewOpp({...newOpp, type: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white"><option>INTERNSHIP</option><option>FULL-TIME</option><option>COMPETITION</option></select>
                  <input placeholder="Deadline (Optional)" value={newOpp.deadline} onChange={e=>setNewOpp({...newOpp, deadline: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <input required placeholder="Tags (comma separated)" value={newOpp.tags} onChange={e=>setNewOpp({...newOpp, tags: e.target.value})} className="bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <input required placeholder="URL Link" value={newOpp.href} onChange={e=>setNewOpp({...newOpp, href: e.target.value})} className="col-span-2 bg-white/5 border border-white/10 p-2 rounded text-sm text-white" />
                  <textarea required placeholder="Description" rows={3} value={newOpp.description} onChange={e=>setNewOpp({...newOpp, description: e.target.value})} className="col-span-2 bg-white/5 border border-white/10 p-2 rounded text-sm text-white resize-none" />
                  <div className="col-span-2 flex gap-2">
                    <button type="submit" className="flex-1 bg-electric-cyan/20 text-electric-cyan py-2 rounded text-xs font-bold tracking-wider hover:bg-electric-cyan/30">{editingId ? 'UPDATE' : 'ADD'} OPPORTUNITY</button>
                    {editingId && <button type="button" onClick={cancelEdit} className="px-4 bg-white/5 border border-white/10 text-white rounded hover:bg-white/10"><X className="w-4 h-4" /></button>}
                  </div>
                </form>
              </div>
              <div>
                <h3 className="font-mono text-xs tracking-[0.2em] text-electric-cyan mb-4 border-b border-white/5 pb-2">MANAGE OPPORTUNITIES</h3>
                <div className="space-y-2">
                  {opportunities.map(o => (
                    <div key={o.id} className="flex items-center justify-between bg-white/[0.02] border border-white/[0.05] p-3 rounded">
                      <div><p className="text-sm font-semibold">{o.title} <span className="text-silver/50 text-xs">@ {o.company}</span></p></div>
                      <div className="flex gap-1">
                        <button onClick={() => startEdit('opportunities', o)} className="text-electric-cyan p-2 hover:bg-electric-cyan/10 rounded"><Pencil className="w-4 h-4" /></button>
                        <button onClick={async ()=>{ await safeFetch(`/api/admin/opportunities?id=${o.id}`, 'DELETE'); fetchData(); showMsg("Deleted"); }} className="text-red-400 p-2 hover:bg-red-400/10 rounded"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                  {opportunities.length === 0 && <p className="text-xs text-silver/40 font-mono">No opportunities found.</p>}
                </div>
              </div>
            </div>
          )}

          {/* BACKUP */}
          {activeTab === 'backup' && (
            <div className="space-y-8 flex flex-col items-center justify-center text-center pt-10">
              <Download className="w-12 h-12 text-electric-cyan opacity-50 mb-4" />
              <div className="max-w-md">
                <h2 className="text-xl font-bold mb-2">Data Persistence Engine</h2>
                <div className="flex gap-4 justify-center">
                  <button onClick={async () => {
                    const res = await fetch('/api/admin/backup'); const data = await res.json();
                    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })); a.download = `qc-backup.json`; a.click();
                  }} className="flex items-center gap-2 bg-electric-cyan text-black px-6 py-3 rounded-lg font-mono text-xs font-bold tracking-wider hover:bg-cyan-dim">
                    <Download className="w-4 h-4" /> EXPORT BACKUP
                  </button>
                  <label className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-6 py-3 rounded-lg font-mono text-xs tracking-wider cursor-pointer hover:bg-white/10">
                    <Upload className="w-4 h-4" /> IMPORT DATA
                    <input type="file" accept=".json" onChange={async (e) => {
                      const file = e.target.files?.[0]; if (!file) return;
                      const reader = new FileReader(); reader.onload = async (e) => {
                        await fetch('/api/admin/backup', { method: 'POST', body: JSON.stringify(JSON.parse(e.target?.result as string)) });
                        fetchData(); showMsg('Restored.');
                      }; reader.readAsText(file);
                    }} className="hidden" />
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
