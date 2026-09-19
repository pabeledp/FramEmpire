import React, { useState, useEffect } from 'react';
import { 
  X, Send, CheckCircle2, Clock, ShieldCheck, Palette, Film, Code2, Download, Copy, Check, MessageSquare, ExternalLink, Sparkles, FileText, Link as LinkIcon
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

    // 1. Render visual order invoice container in offscreen DOM for html2pdf Blob capture
    let base64String = '';
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'fixed';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '0px';
    tempDiv.style.width = '800px';
    tempDiv.style.background = '#ffffff';
    tempDiv.style.color = '#0f172a';
    tempDiv.innerHTML = `
      <div id="invoice-preview" class="invoice-container" style="font-family: Arial, sans-serif; padding: 30px; background: #ffffff; color: #0f172a;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #00f3ff; padding-bottom: 15px; margin-bottom: 20px;">
          <div>
            <h1 style="margin: 0; font-size: 22px; color: #0f172a; font-weight: 900; letter-spacing: 1px;">FRAMEMPIRE STUDIO</h1>
            <p style="margin: 3px 0 0 0; font-size: 11px; color: #64748b;">A Revolution of Digital Engineering</p>
            <p style="margin: 8px 0 0 0; font-size: 12px; color: #475569;"><b>Order Brief ID:</b> ${generatedId}</p>
            <p style="margin: 2px 0 0 0; font-size: 12px; color: #475569;"><b>Date:</b> ${today}</p>
          </div>
          <div style="background: #2A2B30; color: #ffffff; padding: 15px 25px; font-weight: 900; font-size: 16px; letter-spacing: 2px; border-radius: 6px;">
            PROJECT BRIEF
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; gap: 20px; margin-bottom: 25px;">
          <div style="flex: 1;">
            <h4 style="margin: 0 0 6px 0; font-size: 13px; font-weight: bold; color: #0f172a; border-bottom: 2px solid #cbd5e1; padding-bottom: 3px;">CLIENT CONTACT:</h4>
            <p style="margin: 0; font-size: 13px; font-weight: bold; color: #0f172a;">${contactInfo}</p>
            <p style="margin: 3px 0 0 0; font-size: 11px; color: #64748b;">Requested Service: ${displayServiceName}</p>
          </div>
          <div style="flex: 1;">
            <h4 style="margin: 0 0 6px 0; font-size: 13px; font-weight: bold; color: #0f172a; border-bottom: 2px solid #cbd5e1; padding-bottom: 3px;">STUDIO DIRECT CONTACT:</h4>
            <p style="margin: 0; font-size: 11px; color: #334155;"><b>Direct Phone :</b> +880 1615-288259</p>
            <p style="margin: 2px 0 0 0; font-size: 11px; color: #334155;"><b>Official Email :</b> team.framempire@gmail.com</p>
            <p style="margin: 2px 0 0 0; font-size: 11px; color: #334155;"><b>Website :</b> www.framempire.com</p>
          </div>
        </div>

        <div style="background: #f8fafc; border: 1px solid #cbd5e1; padding: 18px; border-radius: 6px; margin-bottom: 20px;">
          <h4 style="margin: 0 0 8px 0; font-size: 13px; font-weight: bold; color: #0f172a;">CLIENT CUSTOM PROJECT REQUIREMENTS & VISION:</h4>
          <p style="margin: 0; font-size: 12px; color: #334155; line-height: 1.6; whitespace: pre-wrap;">${projectDetails.replace(/\n/g, '<br/>')}</p>
        </div>

        ${referenceLinks.trim() ? `
        <div style="background: #f1f5f9; border: 1px solid #cbd5e1; padding: 12px; border-radius: 6px; margin-bottom: 20px; font-size: 11px; color: #334155;">
          <b>Reference / Drive Links:</b> ${referenceLinks}
        </div>
        ` : ''}

        <div style="background: #2A2B30; color: #ffffff; padding: 15px; font-size: 11px; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <p style="margin: 0;"><b>FramEmpire Studio</b> • Dhaka, Bangladesh</p>
            <p style="margin: 3px 0 0 0; color: #cbd5e1;">Our team will review your brief and contact you within 2-4 hours with a custom quote.</p>
          </div>
          <div style="font-weight: bold; font-size: 13px; color: #4ade80;">
            STATUS: BRIEF SUBMITTED
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(tempDiv);

    try {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js');

      const opt = {
        margin: 0.15,
        filename: `Project_Brief_${generatedId}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      const invoiceNode = tempDiv.querySelector('.invoice-container');
      const pdfBlob = await window.html2pdf().set(opt).from(invoiceNode).output('blob');

      base64String = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(pdfBlob);
        reader.onloadend = function () {
          const res = reader.result ? reader.result.split(',')[1] : '';
          resolve(res);
        };
      });
    } catch (err) {
      console.log('html2pdf capture error:', err);
    } finally {
      if (document.body.contains(tempDiv)) {
        document.body.removeChild(tempDiv);
      }
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
    try {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js');
      
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'fixed';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0px';
      tempDiv.style.width = '800px';
      tempDiv.style.background = '#ffffff';
      tempDiv.style.color = '#0f172a';
      tempDiv.innerHTML = `
        <div class="invoice-container" style="font-family: Arial, sans-serif; padding: 30px; background: #ffffff; color: #0f172a;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #00f3ff; padding-bottom: 15px; margin-bottom: 20px;">
            <div>
              <h1 style="margin: 0; font-size: 22px; color: #0f172a; font-weight: 900; letter-spacing: 1px;">FRAMEMPIRE STUDIO</h1>
              <p style="margin: 3px 0 0 0; font-size: 11px; color: #64748b;">A Revolution of Digital Engineering</p>
              <p style="margin: 8px 0 0 0; font-size: 12px; color: #475569;"><b>Order Brief ID:</b> ${invoiceId}</p>
              <p style="margin: 2px 0 0 0; font-size: 12px; color: #475569;"><b>Date:</b> ${issueDate}</p>
            </div>
            <div style="background: #2A2B30; color: #ffffff; padding: 15px 25px; font-weight: 900; font-size: 16px; letter-spacing: 2px; border-radius: 6px;">
              PROJECT BRIEF
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; gap: 20px; margin-bottom: 25px;">
            <div style="flex: 1;">
              <h4 style="margin: 0 0 6px 0; font-size: 13px; font-weight: bold; color: #0f172a; border-bottom: 2px solid #cbd5e1; padding-bottom: 3px;">CLIENT CONTACT:</h4>
              <p style="margin: 0; font-size: 13px; font-weight: bold; color: #0f172a;">${contactInfo}</p>
              <p style="margin: 3px 0 0 0; font-size: 11px; color: #64748b;">Requested Service: ${displayServiceName}</p>
            </div>
            <div style="flex: 1;">
              <h4 style="margin: 0 0 6px 0; font-size: 13px; font-weight: bold; color: #0f172a; border-bottom: 2px solid #cbd5e1; padding-bottom: 3px;">STUDIO DIRECT CONTACT:</h4>
              <p style="margin: 0; font-size: 11px; color: #334155;"><b>Direct Phone :</b> +880 1615-288259</p>
              <p style="margin: 2px 0 0 0; font-size: 11px; color: #334155;"><b>Official Email :</b> team.framempire@gmail.com</p>
              <p style="margin: 2px 0 0 0; font-size: 11px; color: #334155;"><b>Website :</b> www.framempire.com</p>
            </div>
          </div>

          <div style="background: #f8fafc; border: 1px solid #cbd5e1; padding: 18px; border-radius: 6px; margin-bottom: 20px;">
            <h4 style="margin: 0 0 8px 0; font-size: 13px; font-weight: bold; color: #0f172a;">CLIENT CUSTOM PROJECT REQUIREMENTS & VISION:</h4>
            <p style="margin: 0; font-size: 12px; color: #334155; line-height: 1.6; whitespace: pre-wrap;">${projectDetails.replace(/\n/g, '<br/>')}</p>
          </div>

          ${referenceLinks.trim() ? `
          <div style="background: #f1f5f9; border: 1px solid #cbd5e1; padding: 12px; border-radius: 6px; margin-bottom: 20px; font-size: 11px; color: #334155;">
            <b>Reference / Drive Links:</b> ${referenceLinks}
          </div>
          ` : ''}

          <div style="background: #2A2B30; color: #ffffff; padding: 15px; font-size: 11px; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <p style="margin: 0;"><b>FramEmpire Studio</b> • Dhaka, Bangladesh</p>
              <p style="margin: 3px 0 0 0; color: #cbd5e1;">Our team will review your brief and contact you within 2-4 hours with a custom quote.</p>
            </div>
            <div style="font-weight: bold; font-size: 13px; color: #4ade80;">
              STATUS: BRIEF SUBMITTED
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(tempDiv);

      const opt = {
        margin: 0.15,
        filename: `FramEmpire_Project_Brief_${invoiceId}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      const pdfBlob = await window.html2pdf().set(opt).from(tempDiv.querySelector('.invoice-container')).output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `FramEmpire_Project_Brief_${invoiceId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
      document.body.removeChild(tempDiv);
    } catch (err) {
      console.error('Download PDF error:', err);
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
          /* SUBMITTED SUCCESS & INVOICE SCREEN */
          <div className="space-y-6 relative z-10 animate-fade-in text-center">
            
            <div className="w-16 h-16 rounded-full bg-cyan-950 border-2 border-cyan-400 text-cyan-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(0,243,255,0.4)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-['Creato_Display'] text-2xl font-extrabold text-white">
                PROJECT BRIEF SUBMITTED SUCCESSFULLY! 🎉
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                Thank you! We have received your project details. Our creative team will review your brief and contact you within <strong className="text-cyan-300">2-4 hours</strong> with a custom quote.
              </p>
            </div>

            {/* Generated Order Brief Details Card */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-cyan-500/40 text-left space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block uppercase">Order Brief ID</span>
                  <span className="text-sm font-extrabold text-cyan-300 font-mono">{invoiceId}</span>
                </div>
                <button
                  onClick={handleCopyInvoiceNumber}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedInvoice ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedInvoice ? 'Copied ID' : 'Copy ID'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block uppercase">Contact Info</span>
                  <span className="font-semibold text-white truncate block">{contactInfo}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block uppercase">Requested Service</span>
                  <span className="font-semibold text-cyan-400 block">{displayServiceName}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons: WhatsApp & Download PDF */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
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
                className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Download Brief PDF</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
