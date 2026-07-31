import React, { useState } from 'react';
import { Copy, Link, MessageSquare } from 'lucide-react';

export default function AdminPage() {
  const [prefix, setPrefix] = useState('Mr.');
  const [guestName, setGuestName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [generatedMessage, setGeneratedMessage] = useState('');

  const prefixes = [
    'Mr.',
    'Mrs.',
    'Miss',
    'Mr. & Mrs.',
    'Family',
    'Dear'
  ];

  const handleGenerate = () => {
    if (!guestName.trim()) return;

    // Use current origin for the link
    const baseUrl = window.location.origin;
    const fullName = `${prefix} ${guestName.trim()}`;
    const link = `${baseUrl}/?guest=${encodeURIComponent(fullName)}`;
    
    setGeneratedLink(link);

    const message = `Dear ${prefix} ${guestName.trim()} ❤️\n\nWith joyful hearts, we warmly invite you to celebrate one of the most special days of our lives as we begin our journey together.\n\nPlease view our wedding invitation and all the event details through the link below 🌐:\n\n${link}\n\nYour presence would truly mean the world to us, and we would be honored to celebrate this beautiful moment together.\n\nWith love,\n❤️ Gayanath & Kavya`;
    
    setGeneratedMessage(message);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    } catch (err) {
      alert('Failed to copy text');
    }
  };

  return (
    <div className="min-h-screen bg-sand/20 flex flex-col items-center py-12 px-4 font-sans text-zinc-800">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden border border-sage/20">
        
        <div className="bg-sage/10 px-8 py-6 border-b border-sage/20">
          <h1 className="text-2xl md:text-3xl font-serif text-sage font-medium text-center">
            Invitation Link Generator
          </h1>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold text-zinc-500">Prefix</label>
              <select 
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                className="w-full rounded-xl border border-sage/30 bg-sand/30 px-4 py-3 text-sm text-zinc-800 outline-none focus:border-sage focus:ring-1 focus:ring-sage"
              >
                {prefixes.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold text-zinc-500">Guest Name</label>
              <input 
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g. Sanjaya"
                className="w-full rounded-xl border border-sage/30 bg-sand/30 px-4 py-3 text-sm text-zinc-800 outline-none focus:border-sage focus:ring-1 focus:ring-sage"
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!guestName.trim()}
            className="w-full gold-gradient-bg text-paper py-4 rounded-xl text-xs uppercase tracking-widest font-bold shadow-lg shadow-gold/20 disabled:opacity-50 transition-opacity hover:opacity-90"
          >
            Generate Link
          </button>

          {generatedLink && (
            <div className="mt-8 space-y-6 border-t border-sage/20 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-zinc-500">Generated Link</label>
                <div className="flex gap-2">
                  <input 
                    readOnly 
                    value={generatedLink}
                    className="flex-1 rounded-xl border border-sage/30 bg-sage/5 px-4 py-3 text-sm text-zinc-600 outline-none"
                  />
                  <button 
                    onClick={() => copyToClipboard(generatedLink)}
                    className="px-4 py-3 bg-sage text-paper rounded-xl hover:bg-sage/90 transition-colors flex items-center justify-center"
                    title="Copy Link Only"
                  >
                    <Link size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold text-zinc-500 flex justify-between items-end">
                  Message Template
                  <button 
                    onClick={() => copyToClipboard(generatedMessage)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-sage/10 text-sage hover:bg-sage/20 rounded-lg transition-colors"
                  >
                    <Copy size={14} />
                    <span>Copy Full Message</span>
                  </button>
                </label>
                <textarea 
                  readOnly 
                  value={generatedMessage}
                  className="w-full h-64 rounded-xl border border-sage/30 bg-sage/5 px-4 py-4 text-sm text-zinc-700 outline-none resize-none leading-relaxed"
                />
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
