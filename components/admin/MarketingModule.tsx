"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const TEMPLATES = [
  { 
    name: 'Flash Sale', 
    icon: '⚡', 
    data: { subject: 'VIP Early Access: 50% Off', headline: 'THE FLASH DROP IS LIVE', message: 'As a CARTIO VIP, you get first access to our biggest sale of the season. Stock is strictly limited. Secure your assets before the public launch.', ctaText: 'SHOP THE EVENT', ctaLink: 'https://cartio.pk/market' } 
  },
  { 
    name: 'New Arrival', 
    icon: '✨', 
    data: { subject: 'Just Landed: Premium Collection', headline: 'ELEVATE YOUR LIFESTYLE', message: 'Discover our latest curation of premium essentials. Engineered for excellence and designed to elevate your everyday routine.', ctaText: 'EXPLORE NEW', ctaLink: 'https://cartio.pk/market' } 
  },
  { 
    name: 'Restock Alert', 
    icon: '📦', 
    data: { subject: 'Back by Popular Demand', headline: 'THE WAIT IS OVER', message: 'The items you have been asking for are finally back in our vault. Inventory will not last long. Claim yours immediately.', ctaText: 'SECURE YOURS', ctaLink: 'https://cartio.pk/market' } 
  }
];

export default function MarketingModule() {
  const [audienceList, setAudienceList] = useState<string[]>([]);
  const [isLoadingAudience, setIsLoadingAudience] = useState(true);
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    subject: '',
    headline: '',
    message: '',
    ctaText: '',
    ctaLink: 'https://'
  });

  const [confirmModal, setConfirmModal] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Time for the iPhone mock
  const [time, setTime] = useState("");

  useEffect(() => {
    fetchAudience();
    
    // Set mock iPhone time
    const now = new Date();
    setTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));
  }, []);

  const fetchAudience = async () => {
    setIsLoadingAudience(true);
    const { data } = await supabase.from('orders').select('customer_email');
    
    if (data) {
      const uniqueEmails = Array.from(new Set(data.map(order => order.customer_email)));
      setAudienceList(uniqueEmails);
    }
    setIsLoadingAudience(false);
  };

  const applyTemplate = (template: any) => {
    setFormData(template.data);
    setActiveTemplate(template.name);
  };

  const handleLaunchCampaign = async () => {
    if (confirmInput !== 'BLAST') return;
    setIsSending(true);

    try {
      const res = await fetch('/api/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emails: audienceList,
          ...formData
        })
      });

      if (res.ok) {
        alert("Campaign deployed successfully to " + audienceList.length + " clients!");
        setFormData({ subject: '', headline: '', message: '', ctaText: '', ctaLink: 'https://' });
        setConfirmModal(false);
        setConfirmInput("");
        setActiveTemplate(null);
      } else {
        alert("Failed to send campaign.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full pb-20 relative">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12 relative z-10">
        <div className="flex-1 w-full">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter uppercase break-words">CRM Broadcast</h1>
          <p className="text-zinc-400 mt-2 text-sm sm:text-base font-light tracking-wide">Command center for client communication and flash campaigns.</p>
        </div>
        
        {/* AUDIENCE METRIC */}
        <div className="bg-zinc-900/50 backdrop-blur-md border border-white/10 px-8 py-5 rounded-3xl flex items-center gap-5 shrink-0 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white shadow-inner">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Target Audience</p>
            <p className="text-3xl font-black text-white leading-none tracking-tighter">
              {isLoadingAudience ? '...' : audienceList.length} <span className="text-sm text-purple-400 font-bold uppercase tracking-widest ml-1">VIPs</span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative z-10">
        
        {/* LEFT: COMPOSER FORM */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* ✨ 1-CLICK TEMPLATES ✨ */}
          <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-xl">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-4">Quick Deploy Templates</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {TEMPLATES.map((t) => (
                <button 
                  key={t.name}
                  onClick={() => applyTemplate(t)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all border ${
                    activeTemplate === t.name 
                      ? 'bg-purple-600/20 border-purple-500/50 text-purple-300' 
                      : 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="text-lg">{t.icon}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl flex-1">
            <div className="flex items-center justify-between border-b border-white/5 pb-6 mb-8">
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Campaign Details</h2>
              <button 
                onClick={() => {setFormData({ subject: '', headline: '', message: '', ctaText: '', ctaLink: 'https://' }); setActiveTemplate(null);}}
                className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest hover:text-white transition-colors"
              >
                Clear Form
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="group">
                <label className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] mb-2 block transition-colors">Inbox Subject Line</label>
                <input 
                  type="text" 
                  placeholder="e.g., Early Access: 50% Off Everything" 
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 text-white px-5 py-4 rounded-xl outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium" 
                />
              </div>
              
              <div>
                <label className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] mb-2 block">Email Headline</label>
                <input 
                  type="text" 
                  placeholder="e.g., THE SUMMER DROP IS HERE" 
                  value={formData.headline}
                  onChange={(e) => setFormData({...formData, headline: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 text-white px-5 py-4 rounded-xl outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-black text-xl uppercase tracking-widest" 
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] mb-2 block">Message Body</label>
                <textarea 
                  rows={5}
                  placeholder="Write your promotional message here..." 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 text-white px-5 py-4 rounded-xl outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-light resize-none custom-scrollbar leading-relaxed" 
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 p-4 rounded-2xl border border-white/5">
                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2 block">Button Text</label>
                  <input 
                    type="text" 
                    placeholder="e.g., SHOP NOW" 
                    value={formData.ctaText}
                    onChange={(e) => setFormData({...formData, ctaText: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 text-white px-5 py-3 rounded-xl outline-none focus:border-white transition-all font-bold uppercase tracking-widest text-xs" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2 block">Destination URL</label>
                  <input 
                    type="url" 
                    value={formData.ctaLink}
                    onChange={(e) => setFormData({...formData, ctaLink: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 text-zinc-400 px-5 py-3 rounded-xl outline-none focus:border-white transition-all font-mono text-xs" 
                  />
                </div>
              </div>

              <button 
                onClick={() => {
                  if(!formData.subject || !formData.headline || !formData.message) return alert("Please complete the core campaign details.");
                  if(audienceList.length === 0) return alert("You have 0 clients in your audience list.");
                  setConfirmInput("");
                  setConfirmModal(true);
                }}
                className="w-full py-6 bg-white text-black hover:bg-purple-600 hover:text-white hover:shadow-[0_0_30px_rgba(147,51,234,0.4)] rounded-xl font-black text-sm uppercase tracking-[0.3em] transition-all duration-300 mt-4 group flex items-center justify-center gap-4"
              >
                Prepare Launch
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </button>
            </div>
          </div>
        </div>

        {/* ✨ RIGHT: SEXY IPHONE PREVIEW ✨ */}
        <div className="lg:w-[400px] shrink-0 flex flex-col items-center">
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Live Render
          </p>
          
          <div className="w-full aspect-[9/19] bg-black border-[12px] border-zinc-900 rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col ring-1 ring-white/10">
            
            {/* iPhone Dynamic Island */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-30 flex items-center justify-between px-2">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-800/80"></div>
            </div>
            
            {/* Top Status Bar */}
            <div className="h-12 w-full pt-3 px-6 flex justify-between items-center text-white text-xs font-bold z-20 relative">
              <span className="tracking-tighter">{time}</span>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21C7.029 21 2.914 17.657 1.488 13.111l1.928-.55C4.545 16.326 7.973 19 12 19c4.027 0 7.455-2.674 8.584-6.439l1.928.55C21.086 17.657 16.971 21 12 21z"/><path d="M12 3c4.971 0 9.086 3.343 10.512 7.889l-1.928.55C19.455 7.674 16.027 5 12 5 7.973 5 4.545 7.674 3.416 11.439l-1.928-.55C2.914 6.343 7.029 3 12 3z"/></svg>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M21.5 8H2.5A1.5 1.5 0 001 9.5v5A1.5 1.5 0 002.5 16h19a1.5 1.5 0 001.5-1.5v-5A1.5 1.5 0 0021.5 8zM21 14H3V10h18v4z"/><path d="M4 11h2v2H4zM7 11h2v2H7zM10 11h2v2h-2zM13 11h2v2h-2z"/></svg>
              </div>
            </div>

            {/* Email App UI Header */}
            <div className="bg-zinc-900 pb-3 pt-2 px-5 border-b border-zinc-800 shrink-0">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-black text-xs">C</div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm text-white font-bold truncate">CARTIO VIP</p>
                  <p className="text-[10px] text-zinc-400 truncate">To: VIP Client</p>
                </div>
                <p className="text-[10px] text-zinc-500">{time}</p>
              </div>
              <p className="text-[13px] text-white font-bold leading-tight line-clamp-2">
                {formData.subject || 'Subject Line Preview'}
              </p>
            </div>

            {/* Email Render Content (Dark Mode Cartio Style) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#09090b] text-center px-4 py-8">
              <h1 className="text-xl font-black tracking-[4px] uppercase text-white">CARTIO</h1>
              <p className="text-[8px] font-bold tracking-widest text-purple-400 uppercase mt-1">Exclusive VIP Update</p>
              
              <div className="w-12 h-[2px] bg-zinc-800 mx-auto my-6"></div>

              <h2 className="text-lg font-black text-white uppercase tracking-wider mb-4 leading-tight break-words">
                {formData.headline || 'YOUR HEADLINE HERE'}
              </h2>

              <p className="text-[11px] font-light text-zinc-400 leading-relaxed mb-8 whitespace-pre-wrap px-2">
                {formData.message || 'Start typing in the composer to see your message rendered beautifully in real-time...'}
              </p>

              {formData.ctaText && (
                <div className="inline-block bg-white text-black px-6 py-3.5 text-[9px] font-black tracking-[0.2em] uppercase rounded-sm cursor-pointer shadow-lg">
                  {formData.ctaText}
                </div>
              )}
            </div>

            {/* iPhone Home Bar */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-white/20 rounded-full z-20"></div>
          </div>
        </div>

      </div>

      {/* ✨ DRAMATIC LAUNCH MODAL ✨ */}
      {confirmModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setConfirmModal(false)}></div>
          <div className="relative bg-zinc-950 border border-purple-500/30 rounded-[2.5rem] w-full max-w-md p-10 shadow-[0_0_100px_rgba(168,85,247,0.2)] text-center overflow-hidden">
            
            {/* Modal Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-purple-600/20 blur-[50px] rounded-full pointer-events-none"></div>

            <div className="w-20 h-20 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-20"></span>
              <svg className="w-10 h-10 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4 relative z-10">Initiate Broadcast</h2>
            <p className="text-sm text-zinc-400 font-light mb-8 relative z-10 leading-relaxed">
              You are authorizing a mass email deployment to <strong className="text-purple-400">{audienceList.length} verified VIPs</strong>.
              <br/><br/>
              To unlock the launch sequence, type <span className="font-mono bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-white font-bold tracking-widest shadow-inner">BLAST</span> below.
            </p>

            <div className="flex items-center gap-2 mb-8 bg-black/50 p-2 rounded-xl border border-purple-500/20 focus-within:border-purple-500 focus-within:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all relative z-10">
              <input 
                type="text" 
                placeholder="TYPE BLAST..." 
                value={confirmInput} 
                onChange={(e) => setConfirmInput(e.target.value)}
                className="flex-1 w-full bg-transparent text-white px-4 py-3 outline-none font-mono text-center tracking-widest text-sm uppercase placeholder:text-zinc-700"
              />
            </div>

            <div className="flex gap-4 relative z-10">
              <button onClick={() => setConfirmModal(false)} className="flex-1 py-4 bg-zinc-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-zinc-800 transition-colors border border-white/5">Abort</button>
              <button 
                onClick={handleLaunchCampaign} 
                disabled={isSending || confirmInput !== 'BLAST'} 
                className="flex-1 py-4 bg-purple-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-purple-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex justify-center items-center shadow-[0_0_20px_rgba(168,85,247,0.4)] disabled:shadow-none"
              >
                {isSending ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : 'LAUNCH'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}