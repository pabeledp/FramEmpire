import React, { useState } from 'react';
import { Sparkles, ArrowRight, Palette, Film, Code2, Star, Flame, Phone, Mail, Globe, Download, X, Copy, Check, QrCode, MessageCircle, Contact } from 'lucide-react';
import { AGENCY_INFO } from '../../data/creativeData';

const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

export default function HeroSection({ onExplorePortfolio, onOpenEstimator }) {
  const [showContactModal, setShowContactModal] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const qrCodeDirectUrl = `https://quickchart.io/qr?text=BEGIN%3AVCARD%0AVERSION%3A3.0%0AN%3AFramEmpire%20Studio%0AFN%3AFramEmpire%20Studio%0ATEL%3A%2B8801615288259%0AEMAIL%3Ateam.framempire%40gmail.com%0AURL%3Ahttps%3A%2F%2Fwww.framempire.com%0AEND%3AVCARD&size=250&dark=000000&light=ffffff`;

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    try {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js');
      const element = document.getElementById('apple-contact-card-node');
      if (element && window.html2pdf) {
        const opt = {
          margin: 0.1,
          filename: 'FramEmpire_Official_Contact_Card.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, allowTaint: true, logging: false },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
        };
        
        const pdfBlob = await window.html2pdf().set(opt).from(element).output('blob');
        const blobUrl = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'FramEmpire_Official_Contact_Card.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);
      }
    } catch (err) {
      console.error('PDF download error:', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center pt-20 sm:pt-28 pb-12 sm:pb-16 px-4 overflow-hidden bg-grid-pattern">
      {/* Radial Neon Background Orbs */}
      <div className="glow-orb-cyan -top-20 -left-20 animate-pulse-glow" />
      <div className="glow-orb-blue top-1/3 -right-20 animate-pulse-glow" style={{ animationDelay: '1.5s' }} />

      <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Column: Heading & Welcome Message */}
        <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-left">
          
          {/* Welcome Client Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border border-cyan-500/40 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-[0_0_20px_rgba(0,243,255,0.2)]">
            <span className="relative flex h-2 sm:h-2.5 w-2 sm:w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 sm:h-2.5 w-2 sm:w-2.5 bg-cyan-400"></span>
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-cyan-300 tracking-wide uppercase">FramEmpire • Client Portfolio & Portal</span>
          </div>

          {/* Hero Main Headline */}
          <h1 className="font-['Creato_Display'] text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.15] tracking-tight">
            <span className="text-gradient">FramEmpire</span> <br />
            <span className="text-white font-medium text-2xl sm:text-4xl lg:text-5xl block mt-1">{AGENCY_INFO.tagline}</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-2xl leading-relaxed">
            {AGENCY_INFO.fullTagline}
          </p>

          {/* 4 Creative Disciplines Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-1 sm:pt-2">
            <div className="neon-card p-2.5 sm:p-3 flex items-center gap-2 border-blue-500/30">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 shrink-0" />
              <span className="text-[11px] sm:text-xs font-semibold text-white">3D Animation</span>
            </div>
            <div className="neon-card p-2.5 sm:p-3 flex items-center gap-2 border-cyan-500/30">
              <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 shrink-0" />
              <span className="text-[11px] sm:text-xs font-semibold text-white">Graphic Design</span>
            </div>
            <div className="neon-card p-2.5 sm:p-3 flex items-center gap-2 border-purple-500/30">
              <Film className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400 shrink-0" />
              <span className="text-[11px] sm:text-xs font-semibold text-white">Video Editing</span>
            </div>
            <div className="neon-card p-2.5 sm:p-3 flex items-center gap-2 border-cyan-400/30">
              <Code2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-300 shrink-0" />
              <span className="text-[11px] sm:text-xs font-semibold text-white">Web Dev</span>
            </div>
          </div>

          {/* CTA Button Group (ONLY 2 BUTTONS: Explore Portfolio & Contact Card) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2 sm:pt-4">
            <button
              onClick={onExplorePortfolio}
              className="neon-button-primary justify-center w-full sm:w-auto cursor-pointer"
              aria-label="Explore Portfolio Projects"
            >
              <span>Explore Portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Apple Liquid Glass Contact Card Button */}
            <button
              onClick={() => setShowContactModal(true)}
              className="neon-button-secondary justify-center w-full sm:w-auto border-cyan-500/50 hover:border-cyan-400 text-cyan-300 hover:text-white bg-slate-900/80 hover:bg-cyan-950/90 shadow-[0_0_20px_rgba(0,243,255,0.25)] cursor-pointer"
              aria-label="Open Official Contact Card"
            >
              <Contact className="w-4 h-4 text-cyan-400" />
              <span>Contact Card</span>
            </button>
          </div>

        </div>

        {/* Right Column: Highlighting choice project */}
        <div className="lg:col-span-5 relative mt-4 lg:mt-0">
          <div className="neon-card p-4 sm:p-6 border-cyan-400/60 relative z-10 space-y-4 sm:space-y-5 shadow-[0_0_30px_rgba(0,243,255,0.25)] transition-shadow duration-500 hover:shadow-[0_0_45px_rgba(0,243,255,0.4)]">
            <div className="flex flex-col gap-1.5 border-b border-cyan-500/30 pb-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-yellow-500/20 via-amber-500/20 to-cyan-500/20 text-yellow-300 border border-yellow-500/40 text-[10px] sm:text-[11px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                  <Flame className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  <span>ONE OF OUR MOST CLIENT'S CHOICE PROJECTS</span>
                </span>
                <span className="neon-badge text-[9px] border-cyan-400 text-cyan-300">VIMEO HD</span>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-950 border-2 border-cyan-400/80 shadow-[0_0_25px_rgba(0,243,255,0.2)]">
              <iframe
                src="https://player.vimeo.com/video/1133437679?badge=0&autopause=0&player_id=0&app_id=58479"
                className="w-full h-full border-0"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                allowFullScreen
                title="FramEmpire Vimeo Showcase - Shikor TV Commercial Video"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>

            <div className="bg-gradient-to-br from-cyan-950/80 via-slate-900 to-[#070913] p-4 rounded-xl border border-cyan-400/40 space-y-2 shadow-[inset_0_0_20px_rgba(0,243,255,0.1)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-yellow-400 font-bold text-xs">
                  <Star className="w-4 h-4 fill-yellow-400" />
                  <span className="font-['Creato_Display'] text-sm text-white">Shikor TV – Canada Thrill Ad</span>
                </div>
                <div className="flex items-center gap-0.5 text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-yellow-400" />
                  ))}
                </div>
              </div>

              <p className="text-[11px] sm:text-xs text-slate-200 leading-relaxed font-medium">
                Extremely praised and loved by the client for its high-impact visual storytelling, color grade precision, and thrilling motion pace.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* APPLE LIQUID GLASS CONTACT CARD MODAL */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          
          <div className="relative w-full max-w-xl rounded-3xl p-6 sm:p-8 bg-slate-900/80 backdrop-blur-2xl border border-cyan-500/40 shadow-[0_0_60px_rgba(0,243,255,0.3)] text-left overflow-hidden space-y-6">
            
            {/* Top Liquid Ambient Glow Orbs inside Modal */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/30 rounded-full blur-3xl pointer-events-none" />

            {/* Modal Header Controls */}
            <div className="flex items-center justify-between border-b border-cyan-500/30 pb-4 relative z-10">
              <div className="flex items-center gap-2">
                <Contact className="w-5 h-5 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-cyan-300 tracking-widest uppercase">OFFICIAL DIGITAL CONTACT CARD</span>
              </div>

              <button
                onClick={() => setShowContactModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Target Node for HTML2PDF Download */}
            <div id="apple-contact-card-node" className="bg-[#070913] p-6 sm:p-7 rounded-2xl border-2 border-cyan-500/50 shadow-2xl relative overflow-hidden text-slate-100 font-sans">
              
              {/* Card Ambient Neon Backdrop */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* Brand Logo Header (Prominent Logo Only) */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
                <div className="flex items-center">
                  <img 
                    src="/framempire_logo_white.png" 
                    alt="FramEmpire Studio" 
                    className="h-12 sm:h-14 object-contain drop-shadow-[0_0_15px_rgba(0,243,255,0.6)]" 
                  />
                </div>
                <div className="bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  VERIFIED STUDIO
                </div>
              </div>

              {/* Grid: Contact Info + Black-on-White QR Code */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                
                {/* Left: Contact Detail Items */}
                <div className="sm:col-span-7 space-y-3.5">
                  
                  {/* Direct Call */}
                  <div className="flex items-center justify-between bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 hover:border-cyan-500/40 transition-colors">
                    <a href="tel:+8801615288259" className="flex items-center gap-3 group">
                      <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] text-slate-400 uppercase font-mono block">Direct Call</span>
                        <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">+880 1615-288259</span>
                      </div>
                    </a>
                    <button
                      onClick={() => handleCopy('+8801615288259', 'phone')}
                      className="text-slate-400 hover:text-cyan-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                      title="Copy Phone Number"
                    >
                      {copiedField === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* WhatsApp Direct */}
                  <div className="flex items-center justify-between bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 hover:border-emerald-500/40 transition-colors">
                    <a href="https://wa.me/8801615288259" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                      <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] text-slate-400 uppercase font-mono block">WhatsApp Chat</span>
                        <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">+880 1615-288259</span>
                      </div>
                    </a>
                    <button
                      onClick={() => handleCopy('+8801615288259', 'wa')}
                      className="text-slate-400 hover:text-emerald-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                      title="Copy WhatsApp Number"
                    >
                      {copiedField === 'wa' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Email */}
                  <div className="flex items-center justify-between bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 hover:border-blue-500/40 transition-colors">
                    <a href="mailto:team.framempire@gmail.com" className="flex items-center gap-3 group">
                      <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-500/40 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] text-slate-400 uppercase font-mono block">Official Email</span>
                        <span className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">team.framempire@gmail.com</span>
                      </div>
                    </a>
                    <button
                      onClick={() => handleCopy('team.framempire@gmail.com', 'email')}
                      className="text-slate-400 hover:text-blue-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                      title="Copy Email"
                    >
                      {copiedField === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Website */}
                  <div className="flex items-center justify-between bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 hover:border-purple-500/40 transition-colors">
                    <a href="https://www.framempire.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                      <div className="w-8 h-8 rounded-lg bg-purple-950 border border-purple-500/40 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] text-slate-400 uppercase font-mono block">Official Website</span>
                        <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">www.framempire.com</span>
                      </div>
                    </a>
                    <button
                      onClick={() => handleCopy('https://www.framempire.com', 'web')}
                      className="text-slate-400 hover:text-purple-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                      title="Copy Website Link"
                    >
                      {copiedField === 'web' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                </div>

                {/* Right: High-Contrast Black on White Scannable QR Code */}
                <div className="sm:col-span-5 flex flex-col items-center justify-center bg-slate-950 p-4 rounded-xl border border-cyan-500/30 shadow-lg text-center space-y-2">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-md">
                    <img 
                      src={qrCodeDirectUrl} 
                      alt="FramEmpire Contact QR Code" 
                      className="w-28 h-28 object-contain rounded-lg" 
                    />
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-300 font-semibold">
                    <QrCode className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Scan to Save Contact</span>
                  </div>
                </div>

              </div>

            </div>

            {/* Modal Bottom Download PDF Action Button */}
            <div className="pt-1 flex items-center justify-between gap-3 relative z-10">
              <span className="text-[11px] text-slate-400 font-mono">
                Apple Liquid Glass Edition • FramEmpire Contact Card
              </span>

              <button
                onClick={handleDownloadPdf}
                disabled={isDownloadingPdf}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Download className={`w-3.5 h-3.5 text-cyan-400 ${isDownloadingPdf ? 'animate-bounce' : ''}`} />
                <span>{isDownloadingPdf ? 'Downloading PDF...' : 'Download PDF'}</span>
              </button>
            </div>

          </div>

        </div>
      )}

    </section>
  );
}


