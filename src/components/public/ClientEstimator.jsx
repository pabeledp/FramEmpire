import React, { useState, useEffect } from 'react';
import { 
  X, Send, CheckCircle2, Clock, ShieldCheck, Palette, Film, Code2, Download, Copy, Check, MessageSquare, ExternalLink, Sparkles, FileText, Link as LinkIcon, Phone, Mail, Globe
} from 'lucide-react';
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

const SERVICE_OPTIONS = [
  { id: 'graphic-design', label: 'Graphic Design & Branding', icon: Palette, color: 'text-blue-400 bg-blue-950/60 border-blue-500/40' },
  { id: 'video-editing', label: 'Video Editing & Motion Cuts', icon: Film, color: 'text-indigo-400 bg-indigo-950/60 border-indigo-500/40' },
  { id: 'web-dev', label: 'Web & Interactive Dev', icon: Code2, color: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/40' },
];

export default function ClientEstimator({ isOpen, onClose, initialService = 'graphic-design' }) {
  const [selectedService, setSelectedService] = useState(initialService);
  const [customServiceText, setCustomServiceText] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [projectDetails, setProjectDetails] = useState('');
  const [referenceLinks, setReferenceLinks] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedInvoice, setCopiedInvoice] = useState(false);
  const [invoiceId, setInvoiceId] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  useEffect(() => {
    if (initialService) {
      const exists = SERVICE_OPTIONS.some(s => s.id === initialService);
      if (exists) {
        setSelectedService(initialService);
      } else {
        setSelectedService('graphic-design');
      }
    }
  }, [initialService]);

  if (!isOpen) return null;

  const activeServiceObj = SERVICE_OPTIONS.find(s => s.id === selectedService);
  const displayServiceName = customServiceText.trim() || (activeServiceObj ? activeServiceObj.label : 'Custom Creative Project');

  const handleSubmitBrief = async (e) => {
    e.preventDefault();
    if (!contactInfo.trim()) {
      alert('Please enter your Email, Phone or WhatsApp number so we can reach you.');
      return;
    }

    if (!projectDetails.trim()) {
      alert('Please describe your project requirements, vision or timeline.');
      return;
    }

    setIsSubmitting(true);

    const stamp = Math.floor(100000 + Math.random() * 900000);
    const generatedId = `FE-INV-${stamp}`;
    const today = new Date().toLocaleDateString('en-GB');

    setInvoiceId(generatedId);
    setIssueDate(today);

    // 1. Generate Base64 PDF string for Google Drive upload
    let base64String = '';
    try {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js');
      
      // Temporary offscreen element for Google Drive background upload payload
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '0px';
      tempDiv.style.top = '0px';
      tempDiv.style.width = '794px';
      tempDiv.style.zIndex = '-9999';
      tempDiv.style.opacity = '0.01';
      tempDiv.style.pointerEvents = 'none';
      tempDiv.innerHTML = `
        <div style="font-family: Arial, sans-serif; padding: 35px; background: #070913; color: #f8fafc; border: 3px solid #00f3ff; border-radius: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #00f3ff; padding-bottom: 15px; margin-bottom: 20px;">
            <div>
              <h1 style="margin: 0; font-size: 24px; color: #ffffff; font-weight: 900; letter-spacing: 1px;">FRAMEMPIRE STUDIO</h1>
              <p style="margin: 4px 0 0 0; font-size: 11px; color: #00f3ff; font-weight: bold;">A Revolution of Digital Engineering</p>
              <p style="margin: 8px 0 0 0; font-size: 12px; color: #cbd5e1;"><b>Order Brief ID:</b> ${generatedId}</p>
              <p style="margin: 2px 0 0 0; font-size: 12px; color: #cbd5e1;"><b>Date:</b> ${today}</p>
            </div>
            <div style="background: #0f172a; color: #00f3ff; border: 1px solid #00f3ff; padding: 12px 20px; font-weight: 900; font-size: 14px; letter-spacing: 2px; border-radius: 8px; text-align: center;">
              OFFICIAL PROJECT BRIEF
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; gap: 20px; margin-bottom: 25px;">
            <div style="flex: 1; background: #0f172a; padding: 15px; border-radius: 8px; border: 1px solid #334155;">
              <h4 style="margin: 0 0 6px 0; font-size: 12px; font-weight: bold; color: #00f3ff; text-transform: uppercase;">CLIENT CONTACT DETAILS:</h4>
              <p style="margin: 0; font-size: 13px; font-weight: bold; color: #ffffff;">${contactInfo}</p>
              <p style="margin: 4px 0 0 0; font-size: 11px; color: #cbd5e1;">Requested Service: <b>${displayServiceName}</b></p>
            </div>
            <div style="flex: 1; background: #0f172a; padding: 15px; border-radius: 8px; border: 1px solid #334155;">
              <h4 style="margin: 0 0 6px 0; font-size: 12px; font-weight: bold; color: #00f3ff; text-transform: uppercase;">STUDIO DIRECT CONTACT:</h4>
              <p style="margin: 0; font-size: 11px; color: #cbd5e1;"><b>Direct Phone :</b> +880 1615-288259</p>
              <p style="margin: 2px 0 0 0; font-size: 11px; color: #cbd5e1;"><b>Official Email :</b> team.framempire@gmail.com</p>
              <p style="margin: 2px 0 0 0; font-size: 11px; color: #cbd5e1;"><b>Website :</b> www.framempire.com</p>
            </div>
          </div>

          <div style="background: #0f172a; border: 1px solid #334155; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h4 style="margin: 0 0 10px 0; font-size: 12px; font-weight: bold; color: #00f3ff; text-transform: uppercase;">CLIENT CUSTOM PROJECT REQUIREMENTS & VISION:</h4>
            <p style="margin: 0; font-size: 12px; color: #e2e8f0; line-height: 1.6; white-space: pre-wrap;">${projectDetails}</p>
          </div>

          ${referenceLinks.trim() ? `
          <div style="background: #0f172a; border: 1px solid #334155; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-size: 11px; color: #cbd5e1;">
            <b style="color: #00f3ff;">Reference / Moodboard Link:</b> ${referenceLinks}
          </div>
          ` : ''}

          <div style="background: #0f172a; border: 1px solid #00f3ff; color: #ffffff; padding: 15px; font-size: 11px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <p style="margin: 0; font-weight: bold; color: #ffffff;">FramEmpire Studio • Dhaka, Bangladesh</p>
              <p style="margin: 3px 0 0 0; color: #94a3b8;">Our creative director will review your brief and contact you within 2-4 hours.</p>
            </div>
            <div style="font-weight: bold; font-size: 12px; color: #4ade80; border: 1px solid #4ade80; padding: 4px 10px; border-radius: 4px;">
              STATUS: SUBMITTED
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(tempDiv);

      const opt = {
        margin: 0.15,
        filename: `FramEmpire_Project_Brief_${generatedId}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      const pdfBlob = await window.html2pdf().set(opt).from(tempDiv.children[0]).output('blob');

      base64String = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(pdfBlob);
        reader.onloadend = function () {
          const res = reader.result ? reader.result.split(',')[1] : '';
          resolve(res);
        };
      });

      document.body.removeChild(tempDiv);
    } catch (err) {
      console.log('PDF Base64 generation error:', err);
    }

    // 2. Dispatch POST payload to Google Apps Script Endpoint
    const googleWebAppUrl = 'https://script.google.com/macros/s/AKfycbwp0iTjxYeJMktukdeqWkzZuMxolf-91_hGGZ0Cml-d5RoXLDoWReEChTsbpSBfwHZD/exec';
    
    const googlePayload = {
      client_email: contactInfo,
      selected_service: displayServiceName,
      package_name: 'Custom Project Brief',
      final_price: 'Custom Quote Request',
      pdfBase64: base64String || '',
      custom_details: projectDetails,
      reference_links: referenceLinks
    };

    try {
      await fetch(googleWebAppUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(googlePayload)
      });
    } catch (gasErr) {
      console.log('Google Apps Script submission dispatch error:', gasErr);
    }

    setIsSubmitting(false);
    setSubmitted(true);
  };

  const handleDownloadInvoicePdf = async () => {
    setIsDownloadingPdf(true);
    try {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js');
      const element = document.getElementById('framempire-official-invoice-node');
      if (element && window.html2pdf) {
        const opt = {
          margin: 0.15,
          filename: `FramEmpire_Project_Brief_${invoiceId}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: false },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        
        const pdfBlob = await window.html2pdf().set(opt).from(element).output('blob');
        const blobUrl = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `FramEmpire_Project_Brief_${invoiceId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
      }
    } catch (err) {
      console.error('Download PDF error:', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleCopyInvoiceNumber = () => {
    navigator.clipboard.writeText(invoiceId);
    setCopiedInvoice(true);
    setTimeout(() => setCopiedInvoice(false), 2000);
  };

  const resetFormState = () => {
    setSubmitted(false);
    setContactInfo('');
    setProjectDetails('');
    setReferenceLinks('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl p-6 sm:p-8 bg-slate-900/90 backdrop-blur-2xl border border-cyan-500/40 shadow-[0_0_60px_rgba(0,243,255,0.25)] text-left overflow-hidden my-auto space-y-6">
        
        {/* Ambient Top Glow Orbs */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/30 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/30 pb-4 relative z-10">
          <div className="flex items-center gap-3">
            <img src="/framempire_logo_white.png" alt="FramEmpire Studio" className="h-8 sm:h-9 object-contain drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]" />
            <div>
              <h3 className="font-['Creato_Display'] text-base sm:text-lg font-bold text-white tracking-wide">
                PROJECT BRIEF & QUOTE REQUEST
              </h3>
              <p className="text-[11px] text-cyan-400 font-mono">FramEmpire Studio • Zero Hassle Onboarding</p>
            </div>
          </div>

          <button
            onClick={resetFormState}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body vs Submitted State */}
        {!submitted ? (
          <form onSubmit={handleSubmitBrief} className="space-y-5 relative z-10">
            
            {/* Service Selector Pills */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                1. Select Desired Service
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {SERVICE_OPTIONS.map((opt) => {
                  const IconComp = opt.icon;
                  const isSelected = selectedService === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setSelectedService(opt.id);
                        setCustomServiceText('');
                      }}
                      className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                        isSelected
                          ? `${opt.color} shadow-[0_0_15px_rgba(0,243,255,0.2)] scale-[1.02]`
                          : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:border-cyan-500/30 hover:text-slate-200'
                      }`}
                    >
                      <IconComp className="w-4 h-4 shrink-0" />
                      <span className="text-xs font-bold leading-tight">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Client Contact Info Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                2. Your Contact Details <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="Enter your Email address, Phone or WhatsApp number..."
                required
                className="w-full bg-slate-950/90 border border-slate-800 focus:border-cyan-400 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-colors shadow-inner"
              />
            </div>

            {/* Custom Project Details Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block flex items-center justify-between">
                <span>3. Project Requirements & Vision <span className="text-cyan-400">*</span></span>
                <span className="text-[10px] text-slate-400 font-normal">Describe in your own words</span>
              </label>
              <textarea
                value={projectDetails}
                onChange={(e) => setProjectDetails(e.target.value)}
                rows={4}
                placeholder="Describe your project requirements, goals, preferred timeline, budget ideas, or instructions..."
                required
                className="w-full bg-slate-950/90 border border-slate-800 focus:border-cyan-400 rounded-xl p-4 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-colors leading-relaxed shadow-inner resize-none"
              />
            </div>

            {/* Reference Links Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span>4. Reference Links / Moodboard (Optional)</span>
              </label>
              <input
                type="url"
                value={referenceLinks}
                onChange={(e) => setReferenceLinks(e.target.value)}
                placeholder="Paste Google Drive, Dropbox, Pinterest, or YouTube link..."
                className="w-full bg-slate-950/90 border border-slate-800 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-colors shadow-inner"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Instant Confirmation & Custom Quote</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-extrabold text-xs sm:text-sm py-3 px-6 rounded-xl flex items-center gap-2 shadow-[0_0_25px_rgba(0,243,255,0.35)] hover:shadow-[0_0_35px_rgba(0,243,255,0.5)] transition-all cursor-pointer border border-cyan-400 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin text-white" />
                    <span>Processing Brief...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-white" />
                    <span>Submit Project Brief 🚀</span>
                  </>
                )}
              </button>
            </div>

          </form>
        ) : (
          /* SUBMITTED SUCCESS & OFFICIAL GORGEOUS 1-PAGE INVOICE CARD SCREEN */
          <div className="space-y-6 relative z-10 animate-fade-in text-left">
            
            <div className="flex items-center justify-between bg-cyan-950/80 border border-cyan-500/40 p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400 text-cyan-300 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-['Creato_Display'] text-base font-extrabold text-white">
                    PROJECT BRIEF SUBMITTED SUCCESSFULLY! 🎉
                  </h4>
                  <p className="text-xs text-slate-300">
                    Our creative team will review your brief and contact you within <strong className="text-cyan-300">2-4 hours</strong> with a custom quote.
                  </p>
                </div>
              </div>

              <button
                onClick={handleCopyInvoiceNumber}
                className="bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                {copiedInvoice ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedInvoice ? 'Copied' : 'Copy ID'}</span>
              </button>
            </div>

            {/* TARGET NODE FOR HTML2PDF CAPTURE: GORGEOUS OFFICIAL FRAMEMPIRE 1-PAGE INVOICE CARD */}
            <div id="framempire-official-invoice-node" className="bg-[#070913] p-6 sm:p-7 rounded-2xl border-2 border-cyan-500/50 shadow-2xl relative overflow-hidden text-slate-100 font-sans space-y-5">
              
              {/* Card Ambient Neon Backdrop */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* Brand Logo & Invoice Document Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <img 
                    src="/framempire_logo_white.png" 
                    alt="FramEmpire Studio" 
                    className="h-10 sm:h-12 object-contain drop-shadow-[0_0_15px_rgba(0,243,255,0.6)]" 
                  />
                  <div>
                    <h2 className="font-['Creato_Display'] text-lg font-black text-white tracking-wider">FRAMEMPIRE STUDIO</h2>
                    <span className="text-[10px] text-cyan-400 font-mono block">A REVOLUTION OF DIGITAL ENGINEERING</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="bg-cyan-950 border border-cyan-500/50 text-cyan-300 text-[10px] font-mono font-extrabold px-3 py-1 rounded-full uppercase tracking-wider block mb-1">
                    OFFICIAL PROJECT BRIEF
                  </span>
                  <span className="text-xs font-mono font-bold text-white block">ID: {invoiceId}</span>
                  <span className="text-[10px] text-slate-400 font-mono block">Date: {issueDate}</span>
                </div>
              </div>

              {/* Grid: Client Contact + Studio Direct Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Client Detail Item */}
                <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-cyan-400 font-mono font-bold uppercase tracking-widest block">CLIENT DETAILS</span>
                  <p className="text-xs font-bold text-white truncate">{contactInfo}</p>
                  <p className="text-[11px] text-slate-300">Requested Service: <strong className="text-cyan-300">{displayServiceName}</strong></p>
                </div>

                {/* Studio Detail Item */}
                <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 space-y-1 text-xs">
                  <span className="text-[10px] text-cyan-400 font-mono font-bold uppercase tracking-widest block">STUDIO DIRECT CONTACT</span>
                  <div className="space-y-0.5 text-slate-300 text-[11px]">
                    <p className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-cyan-400" /> <span>+880 1615-288259</span></p>
                    <p className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-cyan-400" /> <span>team.framempire@gmail.com</span></p>
                    <p className="flex items-center gap-1.5"><Globe className="w-3 h-3 text-cyan-400" /> <span>www.framempire.com</span></p>
                  </div>
                </div>

              </div>

              {/* Client Custom Requirements Textbox */}
              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[10px] text-cyan-400 font-mono font-bold uppercase tracking-widest block">
                  CLIENT CUSTOM PROJECT REQUIREMENTS & VISION
                </span>
                <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-medium">
                  {projectDetails}
                </p>
              </div>

              {/* Reference / Moodboard Link Box if provided */}
              {referenceLinks.trim() && (
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">Reference / Moodboard Link</span>
                  <a href={referenceLinks} target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline font-semibold text-xs flex items-center gap-1">
                    <span>{referenceLinks}</span>
                    <ExternalLink className="w-3 h-3 text-cyan-400" />
                  </a>
                </div>
              )}

              {/* Invoice Footer Bar */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>FramEmpire Studio • Dhaka, Bangladesh</span>
                <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-500/40">
                  STATUS: BRIEF SUBMITTED
                </span>
              </div>

            </div>

            {/* Modal Action Buttons: WhatsApp Chat & Download PDF */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <a
                href={`https://wa.me/8801615288259?text=Hi%20FramEmpire%20Studio!%20I%20just%20submitted%20a%20project%20brief%20(${invoiceId})%20for%20${encodeURIComponent(displayServiceName)}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp Direct</span>
              </a>

              <button
                onClick={handleDownloadInvoicePdf}
                disabled={isDownloadingPdf}
                className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Download className={`w-4 h-4 text-cyan-400 ${isDownloadingPdf ? 'animate-bounce' : ''}`} />
                <span>{isDownloadingPdf ? 'Downloading PDF...' : 'Download Brief PDF'}</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
